from fastapi import FastAPI, File, UploadFile
import shutil
import os
import subprocess
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
OUTPUT_DIR = "separated"

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

@app.post("/remove_vocals/")
async def remove_vocals(file: UploadFile = File(...)):
    try:
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)


        command = f'python -m demucs --mp3 --two-stems=vocals "{file_path}"'
        subprocess.run(command, shell=True, check=True)


        song_name = os.path.splitext(file.filename)[0]
        instrumental_path = os.path.join("separated", "htdemucs", song_name, "no_vocals.mp3")

        print(f"Processed File Path: {instrumental_path}")  # Debugging
       
        if os.path.exists(instrumental_path):
            return JSONResponse(content={"instrumental_url": f"/download/{song_name}"})
        else:
            return JSONResponse(content={"error": "Instrumental file not found."}, status_code=404)
    except Exception as e:
        print(f"Error: {e}")
        return JSONResponse(content={"error": "Internal server error"}, status_code=500)

@app.get("/download/{song_name}")
async def download_file(song_name: str):
    instrumental_path = os.path.join("separated", "htdemucs", song_name, "no_vocals.mp3")

    print(f"Serving File Path: {instrumental_path}") 

    if os.path.exists(instrumental_path):
        return FileResponse(instrumental_path, media_type="audio/mpeg", filename=f"{song_name}_instrumental.mp3")
    else:
        return JSONResponse(content={"error": "File not found."}, status_code=404)
