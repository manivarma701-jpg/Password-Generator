/*
 * Password Generator - ReactJS
 * Lines of Code: ~210
 * Run: npx create-react-app pgen && copy files
 */
import React, { useState, useEffect } from 'react';
import './App.css';

const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const DIGIT = '0123456789';
const SYMBOL = '!@#$%^&*()_+-=[]{}'; 

function strength(pwd) {
  let s = 0;
  if (pwd.length >= 8)  s++;
  if (pwd.length >= 12) s++;
  if (/[A-Z]/.test(pwd))  s++;
  if (/[0-9]/.test(pwd))  s++;
  if (/[^A-Za-z0-9]/.test(pwd)) s++;
  return s;
}

const strengthColor = ['#ff4444','#ff8800','#ffcc00','#88cc00','#00cc66'];
const strengthLabel = ['VERY WEAK','WEAK','MODERATE','STRONG','VERY STRONG'];

export default function App() {
  const [length, setLength] = useState(12);
  const [opts, setOpts] = useState({ upper: true, digit: true, symbol: true });
  const [pwd, setPwd] = useState('');
  const [copied, setCopied] = useState(false);
  const [shake, setShake] = useState(false);

  const generate = () => {
    let pool = LOWER;
    if (opts.upper)  pool += UPPER;
    if (opts.digit)  pool += DIGIT;
    if (opts.symbol) pool += SYMBOL;
    if (pool === LOWER) { alert('Select at least one option!'); return; }

    let p = '';
    for (let i = 0; i < length; i++)
      p += pool[Math.floor(Math.random() * pool.length)];

    setPwd(p);
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const copy = async () => {
    await navigator.clipboard.writeText(pwd);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const s = pwd ? strength(pwd) : 0;

  return (
    <div className="bg">
      <div className="card slide-up">
        <h1>🔐 Password Generator</h1>

        <label>Length: <b>{length}</b></label>
        <input type="range" min="4" max="32"
          value={length}
          onChange={e => setLength(+e.target.value)} />

        <div className="chips">
          {['upper','digit','symbol'].map(k => (
            <label key={k} className={`chip ${opts[k]?'on':''}`}>
              <input type="checkbox" hidden checked={opts[k]}
                onChange={e => setOpts({...opts,[k]:e.target.checked})}/>
              {k.toUpperCase()}
            </label>
          ))}
        </div>

        <div className={`output ${shake?'shake':''} pulse`}>{pwd || 'Click Generate!'}</div>

        <div className="bar-wrap">
          <div className="bar"
            style={{ width: `${s*20}%`, background: strengthColor[s] }}>
          </div>
        </div>
        <p className="lbl">{s ? strengthLabel[s] : ''}</p>

        <button className="btn" onClick={generate}>⚡ Generate</button>
        <button className="btn copy" onClick={copy}>
          {copied ? '✓ Copied!' : '📋 Copy'}
        </button>
      </div>
    </div>
  );
}
