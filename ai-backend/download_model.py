import os
from huggingface_hub import hf_hub_download

# Define model details
REPO_ID = "Qwen/Qwen2.5-0.5B-Instruct-GGUF"
FILENAME = "qwen2.5-0.5b-instruct-q4_k_m.gguf"
LOCAL_DIR = os.path.join(os.path.dirname(__file__), "models")

print(f"Downloading {FILENAME} from {REPO_ID}...")
print("This may take a few minutes depending on your internet connection.")

# Ensure directory exists
os.makedirs(LOCAL_DIR, exist_ok=True)

# Download the model
model_path = hf_hub_download(
    repo_id=REPO_ID, 
    filename=FILENAME, 
    local_dir=LOCAL_DIR,
    local_dir_use_symlinks=False
)

print(f"\n✅ Download complete!")
print(f"Model saved to: {model_path}")
print("You are now ready to run the local offline Chatbot.")
