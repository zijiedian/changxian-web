import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

const API_BASE = '';

export default function Login() {
  const isLoggedIn = Boolean(localStorage.getItem('token'));
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const qrCodeRef = useRef(null);
  const pollingRef = useRef(null);
  const [loginState, setLoginState] = useState('init'); // init, loading, waiting, success, expired
  const [error, setError] = useState('');
  const [state, setState] = useState('');
  const [userInfo, setUserInfo] = useState(null);

  // 处理微信回调
  useEffect(() => {
    const token = searchParams.get('token');
    const nickname = searchParams.get('nickname');
    const headimgurl = searchParams.get('headimgurl');

    if (token && nickname) {
      // 保存登录信息
      localStorage.setItem('token', token);
      localStorage.setItem('userInfo', JSON.stringify({ nickname, headimgurl }));
      setUserInfo({ nickname, headimgurl });
      setLoginState('success');
      
      // 跳转到个人中心
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
    }
  }, [searchParams, navigate]);

  // 初始化微信登录
  useEffect(() => {
    initWeChatLogin();
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

  const initWeChatLogin = async () => {
    try {
      setLoginState('loading');
      
      // 获取登录参数
      const response = await fetch(`${API_BASE}/api/wechat/login`);
      const data = await response.json();
      
      if (data.code !== 0) {
        throw new Error(data.message || '获取登录参数失败');
      }

      const { app_id, state: loginState, redirect_uri } = data.data;
      setState(loginState);

      // 加载微信JS SDK
      await loadWeChatSDK();

      // 生成二维码
      if (qrCodeRef.current && window.WxLogin) {
        qrCodeRef.current.innerHTML = '';
        new window.WxLogin({
          self_redirect: false,
          id: 'login_container',
          appid: app_id,
          scope: 'snsapi_login',
          redirect_uri: redirect_uri,
          state: loginState,
          style: 'black',
          href: '',
        });
      }

      setLoginState('waiting');

      // 开始轮询登录状态
      startPolling(loginState);
    } catch (err) {
      console.error('初始化微信登录失败:', err);
      setError(err.message || '初始化失败，请刷新页面重试');
      setLoginState('error');
    }
  };

  const loadWeChatSDK = () => {
    return new Promise((resolve, reject) => {
      if (window.WxLogin) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'http://res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js';
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  };

  const startPolling = (loginState) => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
    }

    pollingRef.current = setInterval(async () => {
      try {
        const response = await fetch(`${API_BASE}/api/wechat/status?state=${loginState}`);
        const data = await response.json();

        if (data.code === 0 && data.data.status === 'success') {
          // 登录成功，停止轮询
          clearInterval(pollingRef.current);
          
          // 保存登录信息
          localStorage.setItem('token', data.data.token);
          localStorage.setItem('userInfo', JSON.stringify(data.data.user_info));
          setUserInfo(data.data.user_info);
          setLoginState('success');
          
          // 跳转到个人中心
          setTimeout(() => {
            navigate('/profile');
          }, 1500);
        } else if (data.data.status === 'expired') {
          // 二维码过期
          clearInterval(pollingRef.current);
          setLoginState('expired');
        }
      } catch (err) {
        console.error('查询登录状态失败:', err);
      }
    }, 2000);
  };

  const handleRetry = () => {
    setError('');
    setLoginState('init');
    initWeChatLogin();
  };

  // 步骤列表
  const steps = [
    { title: '等待扫码', desc: '请使用微信扫描二维码', status: loginState === 'init' || loginState === 'loading' ? 'active' : 'pending' },
    { title: '扫码成功', desc: '请在手机确认授权', status: loginState === 'waiting' ? 'active' : 'pending' },
    { title: '登录完成', desc: '自动跳转至个人中心', status: loginState === 'success' ? 'active' : 'pending' },
  ];

  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-brand/20 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-10 h-72 w-72 rounded-full bg-brand/10 blur-3xl" />
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          <header className="rounded-2xl border border-gray-200 bg-white/90 px-4 py-3 shadow-soft backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-brand/10 p-[2px] ring-1 ring-brand/30 shadow-sm">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-brand/15">
                    <img src="/logo.png" alt="尝鲜AI" className="h-6 w-6 rounded-full object-contain drop-shadow-sm" />
                  </div>
                </div>
                <div className="text-base font-semibold text-ink">尝鲜AI</div>
              </div>
              <div className="sm:hidden">
                <details className="relative">
                  <summary className="list-none rounded-full border border-gray-200 bg-white p-2 text-ink shadow-soft">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                      <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <span className="sr-only">菜单</span>
                  </summary>
                  <div className="absolute right-0 mt-2 w-44 rounded-2xl border border-gray-200 bg-white p-2 text-xs shadow-soft">
                    <Link to="/" className="block rounded-xl px-3 py-2 font-semibold text-ink hover:bg-gray-50">
                      首页
                    </Link>
                    <div className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
                      工具库
                    </div>
                    <Link to="/generator" className="block rounded-xl px-3 py-2 text-[11px] font-semibold text-ink hover:bg-gray-50">
                      图文生成
                    </Link>
                    <div className="px-3 py-1 text-[11px] text-muted">更多工具敬请期待</div>
                    <Link to="/articles" className="block rounded-xl px-3 py-2 text-[11px] font-semibold text-ink hover:bg-gray-50">
                      文章
                    </Link>
                    <Link to="/about" className="block rounded-xl px-3 py-2 text-[11px] font-semibold text-ink hover:bg-gray-50">
                      关于我们
                    </Link>
                    {!isLoggedIn && (
                      <Link to="/login" className="block rounded-xl px-3 py-2 text-[11px] font-semibold text-ink hover:bg-gray-50">
                        登录
                      </Link>
                    )}
                    {isLoggedIn && (
                      <Link to="/profile" className="block rounded-xl px-3 py-2 text-[11px] font-semibold text-ink hover:bg-gray-50">
                        个人中心
                      </Link>
                    )}
                  </div>
                </details>
              </div>
              <nav className="hidden flex-wrap items-center gap-3 text-xs font-semibold sm:flex">
                <Link to="/" className="px-3 py-2 text-muted transition hover:text-ink">
                  首页
                </Link>
                <div className="relative group">
                  <button type="button" className="px-3 py-2 text-muted transition hover:text-ink">
                    工具库
                  </button>
                  <div className="absolute left-0 top-full z-20 hidden min-w-[160px] rounded-2xl border border-gray-200 bg-white p-2 shadow-soft group-hover:block">
                    <Link
                      to="/generator"
                      className="block rounded-xl px-3 py-2 text-[11px] font-semibold text-ink transition hover:bg-gray-50"
                    >
                      图文生成
                    </Link>
                    <div className="px-3 py-2 text-[11px] text-muted">更多工具敬请期待</div>
                  </div>
                </div>
                <Link to="/articles" className="px-3 py-2 text-muted transition hover:text-ink">
                  文章
                </Link>
                <Link to="/about" className="px-3 py-2 text-muted transition hover:text-ink">
                  关于我们
                </Link>
                {!isLoggedIn && (
                  <Link to="/login" className="rounded-full bg-brand px-4 py-2 text-white shadow-soft">
                    登录
                  </Link>
                )}
                {isLoggedIn && (
                  <Link to="/profile" className="px-3 py-2 text-muted transition hover:text-ink">
                    个人中心
                  </Link>
                )}
              </nav>
            </div>
          </header>

          <section className="mt-12 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-3 py-1 text-xs text-muted shadow-soft">
                <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                微信登录
              </div>
              <h1 className="mt-4 text-3xl font-semibold leading-tight text-ink sm:text-4xl">
                用微信快速登录，
                <span className="text-brand">开启多工具工作台</span>
              </h1>
              <p className="mt-4 text-sm text-muted sm:text-base">
                登录后同步项目与使用记录，解锁充值、统计与多工具能力。
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  { title: '项目同步', desc: '保存与管理你的历史项目' },
                  { title: '使用统计', desc: '可视化查看每月使用情况' },
                  { title: '充值与额度', desc: '按需补充额度与套餐' },
                  { title: '多工具入口', desc: '持续扩展的工具矩阵' },
                ].map((item) => (
                  <div key={item.title} className="rounded-2xl border border-gray-200 bg-white/90 p-4 shadow-soft">
                    <div className="text-sm font-semibold text-ink">{item.title}</div>
                    <div className="mt-2 text-xs text-muted">{item.desc}</div>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-2xl border border-gray-200 bg-white/80 p-4 text-xs text-muted shadow-soft">
                <div className="font-semibold text-ink">安全说明</div>
                <p className="mt-2">仅获取微信头像与昵称，不会发布任何内容。</p>
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white/95 p-6 shadow-soft">
              <div className="flex items-center justify-between text-xs text-muted">
                <span>登录方式</span>
                <span className="rounded-full border border-brand/20 bg-brand/10 px-2 py-1 font-semibold text-brand-dark">
                  扫码登录
                </span>
              </div>
              <h2 className="mt-3 text-xl font-semibold text-ink">微信扫码登录</h2>
              <p className="mt-3 text-sm text-muted">
                打开微信扫一扫，完成授权后自动进入个人中心。
              </p>

              <div className="mt-6 rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center">
                {error ? (
                  <div className="py-4">
                    <div className="text-red-500 text-sm mb-2">{error}</div>
                    <button
                      onClick={handleRetry}
                      className="text-brand hover:underline text-sm"
                    >
                      点击重试
                    </button>
                  </div>
                ) : loginState === 'loading' ? (
                  <div className="py-8">
                    <div className="animate-spin mx-auto h-8 w-8 border-2 border-brand border-t-transparent rounded-full"></div>
                    <div className="mt-3 text-xs text-muted">正在加载二维码...</div>
                  </div>
                ) : loginState === 'success' && userInfo ? (
                  <div className="py-4">
                    <img 
                      src={userInfo.headimgurl || '/default-avatar.png'} 
                      alt={userInfo.nickname}
                      className="w-16 h-16 rounded-full mx-auto"
                    />
                    <div className="mt-2 text-sm font-semibold text-ink">欢迎，{userInfo.nickname}！</div>
                    <div className="mt-1 text-xs text-green-500">登录成功，正在跳转...</div>
                  </div>
                ) : loginState === 'expired' ? (
                  <div className="py-4">
                    <div className="text-orange-500 text-sm mb-2">二维码已过期</div>
                    <button
                      onClick={handleRetry}
                      className="text-brand hover:underline text-sm"
                    >
                      点击刷新
                    </button>
                  </div>
                ) : (
                  <div id="login_container" ref={qrCodeRef} className="mx-auto inline-block"></div>
                )}
              </div>

              <div className="mt-6 grid gap-3">
                {steps.map((item, index) => (
                  <div key={item.title} className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-3">
                    <div>
                      <div className="text-xs font-semibold text-ink">{item.title}</div>
                      <div className="mt-1 text-[11px] text-muted">{item.desc}</div>
                    </div>
                    <span className={`h-2 w-2 rounded-full ${
                      item.status === 'active' ? 'bg-green-500 animate-pulse' : 
                      item.status === 'pending' ? 'bg-gray-300' : 'bg-brand/70'
                    }`} />
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleRetry}
                className="mt-6 w-full rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white shadow-soft disabled:opacity-50"
                disabled={loginState === 'loading'}
              >
                {loginState === 'loading' ? '加载中...' : '刷新二维码'}
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
