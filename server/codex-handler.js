import fs from 'fs';
import os from 'os';
import path from 'path';

const DEFAULT_MODEL = 'gpt-5-codex';
const DEFAULT_BASE_URL = 'https://api.openai.com/v1';

const readJson = async (req) => {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  const raw = Buffer.concat(chunks).toString('utf8');
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
};

const sendJson = (res, status, payload) => {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
};

const extractOutputText = (data) => {
  if (!data) return '';
  if (typeof data.output_text === 'string') return data.output_text;
  const outputItems = Array.isArray(data.output) ? data.output : [];
  for (const item of outputItems) {
    const content = Array.isArray(item.content) ? item.content : [];
    const textBlock = content.find((block) => block.type === 'output_text' && typeof block.text === 'string');
    if (textBlock) return textBlock.text;
  }
  return '';
};

const stripTomlComment = (line) => {
  const index = line.indexOf('#');
  return index === -1 ? line : line.slice(0, index);
};

const parseToml = (content) => {
  const result = {};
  let section = null;
  const lines = content.split(/\r?\n/);
  for (const rawLine of lines) {
    const cleaned = stripTomlComment(rawLine).trim();
    if (!cleaned) continue;
    const sectionMatch = cleaned.match(/^\[([^\]]+)\]$/);
    if (sectionMatch) {
      section = sectionMatch[1].trim();
      if (!result[section]) result[section] = {};
      continue;
    }
    const kvMatch = cleaned.match(/^([A-Za-z0-9_.-]+)\s*=\s*(.+)$/);
    if (!kvMatch) continue;
    const key = kvMatch[1];
    const rawValue = kvMatch[2].trim();
    let value = rawValue;
    if (rawValue.startsWith('"') && rawValue.endsWith('"')) {
      value = rawValue.slice(1, -1);
    } else if (rawValue === 'true' || rawValue === 'false') {
      value = rawValue === 'true';
    }
    if (section) {
      result[section][key] = value;
    } else {
      result[key] = value;
    }
  }
  return result;
};

const loadCodexSettings = () => {
  const codexHome = process.env.CODEX_HOME || path.join(os.homedir(), '.codex');
  const configPath = path.join(codexHome, 'config.toml');
  const authPath = path.join(codexHome, 'auth.json');
  let config = {};
  if (fs.existsSync(configPath)) {
    try {
      config = parseToml(fs.readFileSync(configPath, 'utf8'));
    } catch (error) {
      config = {};
    }
  }

  const provider = config.model_provider;
  const providerSection = provider ? config[`model_providers.${provider}`] : null;
  const baseUrl = providerSection?.base_url;

  let apiKey;
  if (fs.existsSync(authPath)) {
    try {
      const auth = JSON.parse(fs.readFileSync(authPath, 'utf8'));
      apiKey = auth.OPENAI_API_KEY;
    } catch (error) {
      apiKey = undefined;
    }
  }

  return {
    model: config.model,
    baseUrl,
    apiKey,
  };
};

const buildResponsesUrl = (baseUrl) => {
  if (!baseUrl) return `${DEFAULT_BASE_URL}/responses`;
  const trimmed = baseUrl.replace(/\/+$/, '');
  if (trimmed.endsWith('/responses')) return trimmed;
  return `${trimmed}/responses`;
};

export const handleCodexRequest = async (req, res) => {
  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Method not allowed' });
    return;
  }

  const settings = loadCodexSettings();
  const apiKey = process.env.OPENAI_API_KEY || settings.apiKey;
  if (!apiKey) {
    sendJson(res, 500, { error: 'OPENAI_API_KEY 未配置' });
    return;
  }

  const body = await readJson(req);
  if (!body) {
    sendJson(res, 400, { error: '请求体必须是 JSON' });
    return;
  }

  const prompt = typeof body.prompt === 'string' ? body.prompt.trim() : '';
  if (!prompt) {
    sendJson(res, 400, { error: 'prompt 不能为空' });
    return;
  }

  const model = process.env.OPENAI_MODEL || settings.model || DEFAULT_MODEL;
  const baseUrl = process.env.OPENAI_BASE_URL || settings.baseUrl || DEFAULT_BASE_URL;
  const apiUrl = buildResponsesUrl(baseUrl);

  const payload = {
    model,
    input: [
      {
        role: 'user',
        content: [
          {
            type: 'input_text',
            text: prompt,
          },
        ],
      },
    ],
    text: {
      format: {
        type: 'text',
      },
    },
  };

  let response;
  try {
    response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    sendJson(res, 502, { error: '请求 OpenAI 失败' });
    return;
  }

  let data;
  try {
    data = await response.json();
  } catch (error) {
    sendJson(res, 502, { error: 'OpenAI 返回了无法解析的响应' });
    return;
  }

  if (!response.ok) {
    sendJson(res, response.status, { error: data?.error?.message || 'OpenAI 请求失败' });
    return;
  }

  const outputText = extractOutputText(data);
  if (!outputText) {
    sendJson(res, 502, { error: 'OpenAI 未返回文本结果' });
    return;
  }

  sendJson(res, 200, { result: outputText, model: data.model, id: data.id });
};
