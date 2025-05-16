let chatData = [];

function showVideoClip(src, duration, onComplete) {
  const video = document.createElement("video");
  video.src = src;
  video.autoplay = true;
  video.muted = true;
  video.playsInline = true;
  video.style.position = "fixed";
  video.style.top = "0";
  video.style.left = "0";
  video.style.width = "100vw";
  video.style.height = "100vh";
  video.style.objectFit = "cover";
  video.style.zIndex = "9999";

  document.body.appendChild(video);

  setTimeout(() => {
    video.remove();
    if (typeof onComplete === "function") {
      onComplete();
    }
  }, duration);
}

function loadChatById(targetId) {
  const block = chatData.find(item => item.id === targetId);
  if (!block) return;

  // 🟡 VIDEO TYPE
  if (block.type === "video") {
    showVideoClip(block.videoSrc, block.duration || 5000, () => {
      loadChatById(block.goto);
    });
    return;
  }

  const imageBox = document.getElementById("catImage");
  const commentBox = document.getElementById("catComment");

  const btn1 = document.querySelector(".answer-1");
  const btn2 = document.querySelector(".answer-2");

  // Image
  if (block.image) {
    imageBox.src = block.image;
    imageBox.style.display = "block";
  } else {
    imageBox.style.display = "none";
  }

  // Text
  commentBox.innerHTML = block.comment || "";

  // Button 1
  if (block["answer-1"]) {
    btn1.innerText = block["answer-1"];
    btn1.style.display = "inline-block";
    btn1.onclick = () => loadChatById(block["goto-1"]);
  } else {
    btn1.style.display = "none";
  }

  // Button 2
  if (block["answer-2"]) {
    btn2.innerText = block["answer-2"];
    btn2.style.display = "inline-block";
    btn2.onclick = () => loadChatById(block["goto-2"]);
  } else {
    btn2.style.display = "none";
  }
}

// Load chat data
fetch("cat.json")
  .then(res => res.json())
  .then(data => {
    chatData = data;
    loadChatById(1); // Start chat at ID 1
  })
  .catch(err => {
    document.getElementById("catComment").innerText = "Couldn't load chat 😿";
    document.getElementById("catImage").src = "error.webp";
    console.error(err);
  });
