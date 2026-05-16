from fastapi import APIRouter, UploadFile, File, HTTPException, Request
import shutil
import os
import uuid

router = APIRouter(prefix="/api/uploads", tags=["Upload"])

# Đảm bảo thư mục uploads tồn tại
UPLOAD_DIR = "static/uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

@router.post("/")
async def upload_image(request: Request, file: UploadFile = File(...)):
    # Kiểm tra loại file
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Chỉ cho phép tải lên hình ảnh")
    
    # Tạo tên file duy nhất
    ext = os.path.splitext(file.filename)[1]
    filename = f"{uuid.uuid4()}{ext}"
    file_path = os.path.join(UPLOAD_DIR, filename)
    
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi khi lưu file: {str(e)}")
        
    # Trả về URL đầy đủ dựa trên request hiện tại
    base_url = str(request.base_url).rstrip('/')
    return {"url": f"{base_url}/static/uploads/{filename}"}
