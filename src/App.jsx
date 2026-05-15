import { Amplify, Auth } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { useState, useEffect } from 'react';
import { awsConfig, API_BASE } from './aws-config.js';

Amplify.configure(awsConfig);

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: #0a0a0f;
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
  }

  .bg {
    position: fixed;
    inset: 0;
    z-index: 0;
    background:
      radial-gradient(ellipse 80% 50% at 20% 20%, rgba(99,102,241,0.15) 0%, transparent 60%),
      radial-gradient(ellipse 60% 40% at 80% 80%, rgba(236,72,153,0.12) 0%, transparent 60%),
      radial-gradient(ellipse 50% 60% at 50% 50%, rgba(16,185,129,0.06) 0%, transparent 70%);
  }

  .grid-bg {
    position: fixed;
    inset: 0;
    z-index: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
    background-size: 40px 40px;
  }

  .app {
    position: relative;
    z-index: 1;
    max-width: 720px;
    margin: 0 auto;
    padding: 2.5rem 1.5rem;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 2.5rem;
  }

  .header-left h1 {
    font-family: 'Space Mono', monospace;
    font-size: 1.6rem;
    font-weight: 700;
    background: linear-gradient(135deg, #a78bfa, #ec4899, #34d399);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: -0.5px;
  }

  .header-left .subtitle {
    font-size: 0.75rem;
    color: rgba(255,255,255,0.35);
    margin-top: 4px;
    font-family: 'Space Mono', monospace;
    letter-spacing: 0.5px;
  }

  .subtitle span {
    color: #a78bfa;
  }

  .signout-btn {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    color: rgba(255,255,255,0.6);
    padding: 8px 16px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.8rem;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.2s;
  }

  .signout-btn:hover {
    background: rgba(255,255,255,0.1);
    color: white;
    border-color: rgba(255,255,255,0.2);
  }

  .request-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    backdrop-filter: blur(10px);
  }

  .request-card-title {
    font-size: 0.7rem;
    font-family: 'Space Mono', monospace;
    color: rgba(255,255,255,0.4);
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 1rem;
  }

  .controls {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    align-items: center;
  }

  .styled-select {
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.12);
    color: white;
    padding: 10px 14px;
    border-radius: 10px;
    font-size: 0.85rem;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    outline: none;
    transition: all 0.2s;
    flex: 1;
    min-width: 160px;
  }

  .styled-select:hover, .styled-select:focus {
    border-color: rgba(167,139,250,0.5);
    background: rgba(167,139,250,0.08);
  }

  .styled-select option {
    background: #1a1a2e;
    color: white;
  }

  .request-btn {
    background: linear-gradient(135deg, #6366f1, #a855f7);
    border: none;
    color: white;
    padding: 10px 22px;
    border-radius: 10px;
    font-size: 0.85rem;
    font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
    box-shadow: 0 4px 15px rgba(99,102,241,0.3);
  }

  .request-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(99,102,241,0.45);
  }

  .request-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  .creds-card {
    background: linear-gradient(135deg, rgba(16,185,129,0.1), rgba(52,211,153,0.05));
    border: 1px solid rgba(16,185,129,0.3);
    border-radius: 16px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    animation: slideIn 0.3s ease;
  }

  @keyframes slideIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .creds-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .creds-title {
    font-size: 0.7rem;
    font-family: 'Space Mono', monospace;
    color: #34d399;
    letter-spacing: 2px;
    text-transform: uppercase;
  }

  .timer {
    font-family: 'Space Mono', monospace;
    font-size: 1.1rem;
    font-weight: 700;
    color: #34d399;
    background: rgba(16,185,129,0.15);
    padding: 4px 12px;
    border-radius: 6px;
    border: 1px solid rgba(16,185,129,0.3);
  }

  .timer.warning {
    color: #fbbf24;
    background: rgba(251,191,36,0.15);
    border-color: rgba(251,191,36,0.3);
  }

  .creds-grid {
    display: grid;
    gap: 8px;
  }

  .cred-row {
    display: flex;
    align-items: center;
    gap: 10px;
    background: rgba(0,0,0,0.2);
    border-radius: 8px;
    padding: 8px 12px;
  }

  .cred-label {
    font-size: 0.68rem;
    font-family: 'Space Mono', monospace;
    color: rgba(255,255,255,0.35);
    min-width: 100px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .cred-value {
    font-size: 0.75rem;
    font-family: 'Space Mono', monospace;
    color: #a7f3d0;
    word-break: break-all;
  }

  .section-title {
    font-size: 0.7rem;
    font-family: 'Space Mono', monospace;
    color: rgba(255,255,255,0.4);
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 1rem;
  }

  .history-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 12px;
    padding: 0.9rem 1.1rem;
    margin-bottom: 8px;
    transition: all 0.2s;
  }

  .history-item:hover {
    background: rgba(255,255,255,0.05);
    border-color: rgba(255,255,255,0.1);
  }

  .history-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .resource-icon {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    flex-shrink: 0;
  }

  .resource-icon.s3 { background: rgba(251,146,60,0.15); border: 1px solid rgba(251,146,60,0.2); }
  .resource-icon.dynamodb { background: rgba(99,102,241,0.15); border: 1px solid rgba(99,102,241,0.2); }
  .resource-icon.ec2 { background: rgba(236,72,153,0.15); border: 1px solid rgba(236,72,153,0.2); }

  .history-info .resource-name {
    font-size: 0.85rem;
    font-weight: 600;
    color: white;
    font-family: 'Space Mono', monospace;
  }

  .history-info .history-meta {
    font-size: 0.72rem;
    color: rgba(255,255,255,0.3);
    margin-top: 2px;
  }

  .status-badge {
    font-size: 0.65rem;
    font-family: 'Space Mono', monospace;
    padding: 4px 10px;
    border-radius: 99px;
    letter-spacing: 1px;
    text-transform: uppercase;
    font-weight: 700;
  }

  .status-badge.active {
    background: rgba(16,185,129,0.15);
    color: #34d399;
    border: 1px solid rgba(16,185,129,0.3);
  }

  .status-badge.expired {
    background: rgba(255,255,255,0.05);
    color: rgba(255,255,255,0.3);
    border: 1px solid rgba(255,255,255,0.08);
  }

  .empty-state {
    text-align: center;
    padding: 2rem;
    color: rgba(255,255,255,0.2);
    font-size: 0.85rem;
    font-family: 'Space Mono', monospace;
  }
`;

const resourceIcons = { s3: '🪣', dynamodb: '🗄️', ec2: '⚡' };

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function App({ signOut, user }) {
  const [resource, setResource] = useState('s3');
  const [duration, setDuration] = useState(30);
  const [grants, setGrants] = useState([]);
  const [activeCreds, setActiveCreds] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (!activeCreds) return;
    const interval = setInterval(() => {
      const expiresAt = activeCreds.expiresAt + 'Z';
      const diff = Math.max(0, Math.floor((new Date(expiresAt) - new Date()) / 1000));
      setTimeLeft(diff);
      if (diff === 0) setActiveCreds(null);
    }, 1000);
    return () => clearInterval(interval);
  }, [activeCreds]);

  const loadGrants = () => {
    fetch(`${API_BASE}/requests?userId=${user.username}`)
      .then(r => r.json())
      .then(data => Array.isArray(data) && setGrants(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))))
      .catch(() => {});
  };

  useEffect(() => { loadGrants(); }, [activeCreds]);

  const requestAccess = async () => {
    setLoading(true);
    try {
      const session = await Auth.currentSession();
      const token = session.getIdToken().getJwtToken();
      const res = await fetch(`${API_BASE}/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': token },
        body: JSON.stringify({ userId: user.username, resource, duration })
      });
      const data = await res.json();
      console.log('Response:', data);
      console.log('Status:', res.status);
      console.log(`
export AWS_ACCESS_KEY_ID=${data.accessKeyId}
export AWS_SECRET_ACCESS_KEY=${data.secretAccessKey}
export AWS_SESSION_TOKEN=${data.sessionToken}
`);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const shortId = user.username?.slice(0, 8) + '...';

  return (
    <>
      <style>{styles}</style>
      <div className="bg" />
      <div className="grid-bg" />
      <div className="app">

        <div className="header">
          <div className="header-left">
            <h1>JIT Access</h1>
            <p className="subtitle">signed in as <span>{shortId}</span></p>
          </div>
          <button className="signout-btn" onClick={signOut}>Sign out</button>
        </div>

        <div className="request-card">
          <p className="request-card-title">Request Temporary Access</p>
          <div className="controls">
            <select className="styled-select" value={resource} onChange={e => setResource(e.target.value)}>
              <option value="s3">🪣 S3 — write to bucket</option>
              <option value="dynamodb">🗄️ DynamoDB — read table</option>
              <option value="ec2">⚡ EC2 — describe instances</option>
            </select>
            <select className="styled-select" value={duration} onChange={e => setDuration(Number(e.target.value))} style={{minWidth: '130px', flex: 'none'}}>
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={60}>60 minutes</option>
            </select>
            <button className="request-btn" onClick={requestAccess} disabled={loading}>
              {loading ? 'Requesting...' : '→ Request'}
            </button>
          </div>
        </div>

        {activeCreds && (
          <div className="creds-card">
            <div className="creds-header">
              <span className="creds-title">✓ Access Granted</span>
              <span className={`timer ${timeLeft < 60 ? 'warning' : ''}`}>
                {timeLeft !== null ? formatTime(timeLeft) : '--:--'}
              </span>
            </div>
            <div className="creds-grid">
              <div className="cred-row">
                <span className="cred-label">Access Key</span>
                <span className="cred-value">{activeCreds.accessKeyId}</span>
              </div>
              <div className="cred-row">
                <span className="cred-label">Secret Key</span>
                <span className="cred-value">{'•'.repeat(32)}</span>
              </div>
              <div className="cred-row">
                <span className="cred-label">Session Token</span>
                <span className="cred-value">{activeCreds.sessionToken?.slice(0, 40)}...</span>
              </div>
              <div className="cred-row">
                <span className="cred-label">Expires At</span>
                <span className="cred-value">{activeCreds.expiresAt}</span>
              </div>
            </div>
          </div>
        )}

        <p className="section-title">Access History</p>
        {grants.length === 0 ? (
          <div className="empty-state">no access requests yet</div>
        ) : (
          grants.map(g => (
            <div key={g.requestId} className="history-item">
              <div className="history-left">
                <div className={`resource-icon ${g.resource}`}>
                  {resourceIcons[g.resource] || '🔑'}
                </div>
                <div className="history-info">
                  <div className="resource-name">{g.resource?.toUpperCase()}</div>
                  <div className="history-meta">{g.duration} min · {g.createdAt?.slice(0, 16).replace('T', ' ')}</div>
                </div>
              </div>
              <span className={`status-badge ${g.status === 'ACTIVE' ? 'active' : 'expired'}`}>
                {g.status}
              </span>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default withAuthenticator(App, { hideSignUp: true });