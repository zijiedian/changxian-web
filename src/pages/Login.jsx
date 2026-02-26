import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

const API_BASE = '';

export default function Login() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const qrCodeRef = useRef(null);
  const pollingRef = useRef(null);
  const [loginMethod, setLoginMethod] = useState('wechat'); // wechat | email
  const [emailMode, setEmailMode] = useState('login'); // login | register
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailStatus, setEmailStatus] = useState('idle'); // idle | loading | success | error
  const [emailError, setEmailError] = useState('');
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

  const handleEmailSubmit = (event) => {
    event.preventDefault();
    setEmailError('');
    setEmailStatus('idle');

    const normalizedEmail = email.trim();
    if (!normalizedEmail) {
      setEmailError('请输入邮箱地址');
      setEmailStatus('error');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setEmailError('请输入有效的邮箱地址');
      setEmailStatus('error');
      return;
    }
    if (!password || password.length < 6) {
      setEmailError('密码至少 6 位');
      setEmailStatus('error');
      return;
    }
    if (emailMode === 'register' && password !== confirmPassword) {
      setEmailError('两次输入的密码不一致');
      setEmailStatus('error');
      return;
    }

    setEmailStatus('loading');
    setTimeout(() => {
      const nickname = normalizedEmail.split('@')[0] || normalizedEmail;
      localStorage.setItem('token', `email-${Date.now()}`);
      localStorage.setItem('userInfo', JSON.stringify({ nickname, headimgurl: '', email: normalizedEmail }));
      setUserInfo({ nickname, headimgurl: '' });
      setEmailStatus('success');
      setTimeout(() => {
        navigate('/profile');
      }, 800);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.6),transparent_55%),radial-gradient(circle_at_bottom,rgba(7,193,96,0.22),transparent_60%)]" />
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              'radial-gradient(circle at top, rgba(7,193,96,0.18), transparent 60%), linear-gradient(rgba(7,193,96,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(7,193,96,0.08) 1px, transparent 1px)',
            backgroundSize: '100% 100%, 28px 28px, 28px 28px',
          }}
        />
        <div className="pointer-events-none absolute -top-32 left-1/2 h-[460px] w-[460px] -translate-x-1/2 rounded-full bg-brand/25 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-16 h-72 w-72 rounded-full bg-brand/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-brand/10 blur-3xl" />
        <div className="mx-auto flex min-h-screen w-full max-w-4xl items-center px-4 py-12 sm:px-6 lg:px-10">
          <section className="w-full">
            <header className="text-center">
              <div className="mx-auto flex w-fit items-center gap-3 rounded-full border border-white/60 bg-white/30 px-4 py-2 shadow-soft backdrop-blur-xl">
                <div className="h-9 w-9 rounded-full bg-brand/10 p-[2px] ring-1 ring-brand/30 shadow-sm">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-brand/15">
                    <img src="/logo.png" alt="尝鲜AI" className="h-5 w-5 rounded-full object-contain drop-shadow-sm" />
                  </div>
                </div>
                <div className="text-xs uppercase tracking-[0.3em] text-muted">尝鲜AI</div>
              </div>
              <h1 className="mt-6 text-3xl font-semibold leading-tight text-ink sm:text-4xl">
                登录到
                <span className="text-brand">内容生产工作台</span>
              </h1>
              <p className="mt-3 text-sm text-muted sm:text-base">
                微信扫码或邮箱登录，快速进入你的项目与博客内容。
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-2 text-[11px] font-semibold text-muted">
                {['图文项目同步', '博客内容管理', '跨设备体验'].map((item) => (
                  <span key={item} className="rounded-full border border-gray-200 bg-white/80 px-3 py-1">
                    {item}
                  </span>
                ))}
              </div>
            </header>

            <main className="relative mt-10 rounded-3xl border border-white/40 bg-white/35 p-6 shadow-soft backdrop-blur-2xl lg:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted">
                <span className="uppercase tracking-[0.2em]">Sign in</span>
                <div className="flex items-center gap-2 rounded-full border border-white/60 bg-white/50 p-1 backdrop-blur">
                  {[
                    { id: 'wechat', label: '微信扫码' },
                    { id: 'email', label: '邮箱登录' },
                  ].map((item) => {
                    const active = loginMethod === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setLoginMethod(item.id)}
                        className={`rounded-full px-3 py-1 text-[11px] font-semibold transition ${
                          active ? 'bg-brand text-white shadow-soft' : 'text-muted hover:text-ink'
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {loginMethod === 'wechat' ? (
                <>
                  <h2 className="mt-4 text-2xl font-semibold text-ink">微信扫码登录</h2>
                  <p className="mt-2 text-sm text-muted">打开微信扫一扫，授权后自动进入。</p>

              <div className="mt-6 rounded-2xl border border-dashed border-white/50 bg-white/60 p-6 text-center backdrop-blur">
                    {error ? (
                      <div className="py-4">
                        <div className="text-red-500 text-sm mb-2">{error}</div>
                        <button onClick={handleRetry} className="text-brand hover:underline text-sm">
                          点击重试
                        </button>
                      </div>
                    ) : loginState === 'loading' ? (
                  <div className="py-8">
                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
                    <div className="mt-3 text-xs text-muted">正在加载二维码...</div>
                  </div>
                    ) : loginState === 'success' && userInfo ? (
                      <div className="py-4">
                        <img
                          src={userInfo.headimgurl || '/default-avatar.png'}
                          alt={userInfo.nickname}
                          className="mx-auto h-16 w-16 rounded-full"
                        />
                        <div className="mt-2 text-sm font-semibold text-ink">欢迎，{userInfo.nickname}！</div>
                        <div className="mt-1 text-xs text-green-500">登录成功，正在跳转...</div>
                      </div>
                    ) : loginState === 'expired' ? (
                      <div className="py-4">
                        <div className="text-orange-500 text-sm mb-2">二维码已过期</div>
                        <button onClick={handleRetry} className="text-brand hover:underline text-sm">
                          点击刷新
                        </button>
                      </div>
                    ) : (
                      <div id="login_container" ref={qrCodeRef} className="mx-auto inline-block" />
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleRetry}
                    className="mt-6 w-full rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white shadow-soft disabled:opacity-50"
                    disabled={loginState === 'loading'}
                  >
                    {loginState === 'loading' ? '加载中...' : '刷新二维码'}
                  </button>
                </>
              ) : (
                <>
                  <h2 className="mt-4 text-2xl font-semibold text-ink">邮箱登录 / 注册</h2>
                  <p className="mt-3 text-sm text-muted">
                    使用邮箱完成登录或注册，享受跨设备的内容同步。
                  </p>
                  <div className="mt-4 flex items-center gap-2">
                    {[
                      { id: 'login', label: '已有账号登录' },
                      { id: 'register', label: '注册新账号' },
                    ].map((item) => {
                      const active = emailMode === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setEmailMode(item.id);
                            setEmailError('');
                            setEmailStatus('idle');
                          }}
                          className={`rounded-full px-3 py-1 text-[11px] font-semibold transition ${
                            active
                              ? 'bg-brand/15 text-brand-dark border border-brand/30'
                              : 'text-muted border border-white/60 bg-white/50'
                          }`}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>

                  <form className="mt-6 space-y-4" onSubmit={handleEmailSubmit}>
                    <label className="block text-xs font-semibold text-muted">
                      邮箱地址
                      <input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="name@example.com"
                        className="mt-2 w-full rounded-2xl border border-white/60 bg-white/70 px-4 py-3 text-sm text-ink focus:border-brand/40 focus:outline-none"
                      />
                    </label>
                    <label className="block text-xs font-semibold text-muted">
                      密码
                      <input
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="至少 6 位"
                        className="mt-2 w-full rounded-2xl border border-white/60 bg-white/70 px-4 py-3 text-sm text-ink focus:border-brand/40 focus:outline-none"
                      />
                    </label>
                    {emailMode === 'register' && (
                      <label className="block text-xs font-semibold text-muted">
                        确认密码
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(event) => setConfirmPassword(event.target.value)}
                          placeholder="再次输入密码"
                          className="mt-2 w-full rounded-2xl border border-white/60 bg-white/70 px-4 py-3 text-sm text-ink focus:border-brand/40 focus:outline-none"
                        />
                      </label>
                    )}
                    {emailError && (
                      <div className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
                        {emailError}
                      </div>
                    )}
                    {emailStatus === 'success' && (
                      <div className="rounded-2xl border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-600">
                        登录成功，正在跳转...
                      </div>
                    )}
                    <button
                      type="submit"
                      className="w-full rounded-full bg-brand px-4 py-3 text-xs font-semibold text-white shadow-soft disabled:opacity-50"
                      disabled={emailStatus === 'loading'}
                    >
                      {emailStatus === 'loading'
                        ? '处理中...'
                        : emailMode === 'register'
                          ? '注册并登录'
                          : '立即登录'}
                    </button>
                  </form>
                </>
              )}

              <div className="mt-4 text-center text-[11px] text-muted">
                登录即代表你已同意平台的使用条款与隐私政策
              </div>
            </main>

            <div className="mt-6 rounded-2xl border border-white/50 bg-white/30 p-4 text-center text-xs text-muted shadow-soft backdrop-blur-xl">
              安全说明：授权仅用于登录识别，不会发布内容或获取朋友圈信息。
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
