document.addEventListener('DOMContentLoaded', function() {
    const uploadInput = document.getElementById('upload');
    const preview = document.getElementById('preview');
    const status = document.getElementById('upload-status');
    const result = document.getElementById('result');

    // Your Cloudinary configuration
    const cloudName = 'dpgrx7vjk'; // Your cloud name
    const uploadPreset = 'ocr_unsigned'; // Your upload preset

    uploadInput.addEventListener('change', async function(e) {
        const file = e.target.files[0];
        if (!file) return;

        // Show loading state
        status.textContent = 'Uploading...';
        status.className = 'uploading';
        preview.style.display = 'none';
        result.innerHTML = '';

        try {
            // Create preview
            const reader = new FileReader();
            reader.onload = function(e) {
                preview.src = e.target.result;
                preview.style.display = 'block';
            };
            reader.readAsDataURL(file);

            // Upload to Cloudinary
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', uploadPreset);

            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                {
                    method: 'POST',
                    body: formData
                }
            );

            if (!response.ok) {
                throw new Error(`Upload failed: ${response.statusText}`);
            }

            const data = await response.json();
            
            // Update UI with success
            status.textContent = 'Upload successful!';
            status.className = 'success';
            
            // Show the uploaded image and its URL
            result.innerHTML = `
                <div class="success-message">
                    <p>✅ Image uploaded successfully!</p>
                    <div class="image-link">
                        <a href="${data.secure_url}" target="_blank" class="btn">View Full Image</a>
                        <button onclick="copyToClipboard('${data.secure_url}')" class="btn">Copy URL</button>
                    </div>
                </div>
            `;

            console.log('Upload successful:', data);
        } catch (error) {
            console.error('Upload error:', error);
            status.textContent = `Error: ${error.message}`;
            status.className = 'error';
            result.innerHTML = '<p class="error-message">❌ Upload failed. Please try again.</p>';
        }
    });
});

// Helper function to copy text to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        const status = document.getElementById('upload-status');
        const originalText = status.textContent;
        status.textContent = 'URL copied to clipboard!';
        setTimeout(() => {
            status.textContent = originalText;
        }, 2000);
    }).catch(err => {
        console.error('Could not copy text: ', err);
    });
}
