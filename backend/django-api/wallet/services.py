import requests

RUST_WALLET_URL = "http://localhost:3001/pay"

def process_payment(user_id, amount):
    response = requests.post(RUST_WALLET_URL, json={
        "user_id": user_id,
        "amount": amount
    })
    return response.json()