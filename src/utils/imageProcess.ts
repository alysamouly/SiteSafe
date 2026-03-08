export const processImageFile = (file: File, onComplete: (base64: string, mimeType: string, fileUrl: string) => void) => {
    if (!file.type.startsWith('image/')) {
        alert('Please upload an image file.');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                const maxDim = 1024;

                if (width > maxDim || height > maxDim) {
                    if (width > height) {
                        height = Math.round((height * maxDim) / width);
                        width = maxDim;
                    } else {
                        width = Math.round((width * maxDim) / height);
                        height = maxDim;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.drawImage(img, 0, 0, width, height);
                    const resizedBase64 = canvas.toDataURL('image/jpeg', 0.8);
                    const [prefix, base64] = resizedBase64.split(',');
                    const mimeType = prefix.split(':')[1].split(';')[0];
                    const fileUrl = URL.createObjectURL(file);
                    onComplete(base64, mimeType, fileUrl);
                }
            };
            img.src = result;
        }
    };
    reader.readAsDataURL(file);
};
