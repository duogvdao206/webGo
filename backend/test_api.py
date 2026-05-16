import requests
import json

BASE_URL = "http://127.0.0.1:8000/api"

def test_api():
    # 1. Login
    login_data = {"ten_dang_nhap": "admin", "mat_khau": "admin123"}
    r = requests.post(f"{BASE_URL}/auth/dang-nhap", json=login_data)
    print(f"Login status: {r.status_code}")
    if r.status_code != 200:
        print(r.text)
        return
    
    token = r.json()["token_truy_cap"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # 2. Add product
    product_data = {
        "ten_san_pham": "Sản phẩm Test API",
        "gia": 123456,
        "mo_ta": "Mô tả test",
        "hinh_anh": "http://test.com/img.jpg",
        "so_luong": 10,
        "noi_bat": True
    }
    r = requests.post(f"{BASE_URL}/san-pham/", json=product_data, headers=headers)
    print(f"Add status: {r.status_code}")
    if r.status_code != 200:
        print(r.text)
        return
    
    sp_id = r.json()["id"]
    print(f"Added product ID: {sp_id}")
    
    # 3. Update product
    product_data["ten_san_pham"] = "Sản phẩm Test API Updated"
    r = requests.put(f"{BASE_URL}/san-pham/{sp_id}", json=product_data, headers=headers)
    print(f"Update status: {r.status_code}")
    if r.status_code != 200:
        print(r.text)
    
    # 4. Delete product
    r = requests.delete(f"{BASE_URL}/san-pham/{sp_id}", headers=headers)
    print(f"Delete status: {r.status_code}")
    if r.status_code != 200:
        print(r.text)

if __name__ == "__main__":
    test_api()
