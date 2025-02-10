let port;
let reader;
let textDecoder = new TextDecoderStream();

document.getElementById("connectButton").addEventListener("click", async () => {
    try {
        port = await navigator.serial.requestPort(); // ขอสิทธิ์ใช้ Serial Port
        await port.open({ baudRate: 9600 });

        document.getElementById("statusText").innerText = "เชื่อมต่อสำเร็จ!";
        document.getElementById("statusText").style.color = "green";
        document.getElementById("statusEimoji").innerText = "❤️‍🔥"; // เปลี่ยนอิโมจิเป็น ❤️‍🔥

        // อ่านค่าจาก Serial และแสดงบนเว็บ
        reader = port.readable.pipeThrough(textDecoder).getReader();
        readData();
    } catch (err) {
        console.error("Serial Error: ", err);
        alert("เชื่อมต่อไม่สำเร็จ! ลองใหม่อีกครั้ง");
        document.getElementById("statusText").innerText = "ไม่ได้เชื่อมต่อ";
        document.getElementById("statusText").style.color = "red";
        document.getElementById("statusEimoji").innerText = "💔"; // เปลี่ยนอิโมจิเป็น 💔 เมื่อเชื่อมต่อไม่สำเร็จ
    }
});

async function readData() {
    while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        if (value) {
            console.log(value); // ตรวจสอบค่าที่ได้รับจาก Serial Monitor
            updateRGB(value);
        }
    }
}

function updateRGB(data) {
    const match = data.match(/R:(\d+),G:(\d+),B:(\d+)/);
    if (match) {
        const r = parseInt(match[1]);
        const g = parseInt(match[2]);
        const b = parseInt(match[3]);

        document.getElementById("rValue").innerText = `R: ${r}`;
        document.getElementById("gValue").innerText = `G: ${g}`;
        document.getElementById("bValue").innerText = `B: ${b}`;

        let rgbColor = `rgb(${r},${g},${b})`;
        document.getElementById("colorBox").style.backgroundColor = rgbColor;

        // คำนวณค่า hue-rotate และ brightness
        let hue = Math.atan2(g - b, r - g) * (180 / Math.PI);
        let brightness = (r + g + b) / 765 * 1.5;
        let sepia = 1;

        // เพิ่มเงา drop-shadow ตามสี RGB
        let shadowColor = `rgba(${r},${g},${b}, 0.8)`;
        document.getElementById("statusEimoji").style.filter = `
            sepia(${sepia})
            hue-rotate(${hue}deg)
            brightness(${brightness})
            drop-shadow(0px 0px 20px ${shadowColor})
        `;
    }
}

