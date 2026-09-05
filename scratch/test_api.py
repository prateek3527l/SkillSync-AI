import urllib.request
import json

url = "http://localhost:8000/analyze-resume"
boundary = "---------------------------974767299852498929531610575"

with open("test_docs/resume_sample.pdf", "rb") as f:
    pdf_bytes = f.read()

payload = (
    f"--{boundary}\r\n"
    f'Content-Disposition: form-data; name="target_role"\r\n\r\n'
    f"Full Stack Developer\r\n"
    f"--{boundary}\r\n"
    f'Content-Disposition: form-data; name="resume"; filename="resume_sample.pdf"\r\n'
    f"Content-Type: application/pdf\r\n\r\n"
).encode("utf-8") + pdf_bytes + f"\r\n--{boundary}--\r\n".encode("utf-8")

req = urllib.request.Request(url, data=payload, headers={
    "Content-Type": f"multipart/form-data; boundary={boundary}"
})

try:
    with urllib.request.urlopen(req) as resp:
        res_json = json.loads(resp.read().decode("utf-8"))
        print("SUCCESS! Response JSON:")
        print(json.dumps(res_json, indent=2))
except urllib.error.HTTPError as e:
    print("HTTP ERROR:", e.code, e.read().decode("utf-8"))
