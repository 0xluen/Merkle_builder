import json
import random  # Add this line

from eth_account import Account

def generate_random_ethereum_wallet():
    private_key = Account.create()._private_key.hex()
    address = Account.from_key(private_key).address
    token = round(random.uniform(1, 1000000), 9)  # Random token value (adjust range as needed)
    return {"address": address, "token": token}

def main():
    output_file_path = 'ethereum_wallets.json'

    wallets_data = []
    for _ in range(3000):
        data = generate_random_ethereum_wallet()
        wallets_data.append(data)

    with open(output_file_path, 'w') as file:
        json.dump(wallets_data, file, indent=2)

    print(f'Rastgele Ethereum cüzdanları {output_file_path} dosyasına kaydedildi.')

if __name__ == "__main__":
    main()
