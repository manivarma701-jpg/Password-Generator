"""
============================================================
 PASSWORD GENERATOR - Python (CLI + Flask Backend)
============================================================
 Lines of Code: ~120
 Run CLI : python password_generator.py
 Run API : python password_generator.py server
============================================================
"""
import random
import string
import sys
import secrets
from flask import Flask, jsonify, request

# ---------- Backend Logic ----------
def generate_password(length=12, use_upper=True, use_digit=True,
                      use_symbol=True) -> dict:
    pool = string.ascii_lowercase
    if use_upper:  pool += string.ascii_uppercase
    if use_digit:  pool += string.digits
    if use_symbol: pool += string.punctuation

    # Guarantee at least one of each requested class
    pwd = []
    if use_upper:  pwd.append(secrets.choice(string.ascii_uppercase))
    if use_digit:  pwd.append(secrets.choice(string.digits))
    if use_symbol: pwd.append(secrets.choice(string.punctuation))

    pwd += [secrets.choice(pool) for _ in range(length - len(pwd))]
    random.shuffle(pwd)
    password = ''.join(pwd)
    return {"password": password, "strength": _strength(password)}

def _strength(p: str) -> str:
    score = sum([
        len(p) >= 8,
        len(p) >= 12,
        any(c.isupper() for c in p),
        any(c.isdigit() for c in p),
        any(c in string.punctuation for c in p),
    ])
    return {0: "VERY WEAK", 1: "VERY WEAK",
            2: "MODERATE",   3: "MODERATE",
            4: "STRONG",     5: "VERY STRONG"}[score]

# ---------- CLI Mode ----------
def cli():
    print("\n========== PASSWORD GENERATOR (Python) ==========")
    length = int(input("Length (4-64, default 12): ") or 12)
    u = input("UPPERCASE? (y/n): ").lower() == 'y'
    d = input("Digits?    (y/n): ").lower() == 'y'
    s = input("Symbols?   (y/n): ").lower() == 'y'
    res = generate_password(length, u, d, s)
    print(f"\nPassword : {res['password']}")
    print(f"Strength : {res['strength']}")
    print("==================================================\n")

# ---------- Flask Backend API ----------
app = Flask(__name__)

@app.route('/api/generate', methods=['POST'])
def api_generate():
    data = request.get_json(force=True) or {}
    res = generate_password(
        length=int(data.get('length', 12)),
        use_upper=bool(data.get('upper', True)),
        use_digit=bool(data.get('digit', True)),
        use_symbol=bool(data.get('symbol', True)),
    )
    return jsonify(res)

@app.route('/')
def home():
    return '''
    <h2>Password Generator API</h2>
    POST /api/generate  JSON {"length":12,"upper":true,"digit":true,"symbol":true}
    '''

if __name__ == '__main__':
    if len(sys.argv) > 1 and sys.argv[1] == 'server':
        app.run(debug=True, port=5000)
    else:
        cli()
