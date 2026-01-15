const input = document.getElementById("heightInput");
const minusBtn = document.getElementById("minusBtn");
const plusBtn = document.getElementById("plusBtn");
const applyBtn = document.getElementById("applyBtn");

const applyHeight = async (height) => {
  if (isNaN(height) || height <= 0) return;

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: (h) => {
      const section = document.querySelector("section#tradingview");
      if (!section) return;

      const parentDiv = section.closest("div");
      if (!parentDiv) return;

      parentDiv.style.height = `${h}px`;
      parentDiv.style.maxHeight = `${h}px`;
      parentDiv.style.overflow = "auto";

      const obSection = document.querySelector(".oVqlU");
      if (!obSection) return;

      obSection.style.height = `${h + 44}px`;
    },
    args: [height]
  });
};

const getCurrentHeight = async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  const results = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      const section = document.querySelector("section#tradingview");
      if (!section) return null;

      const parentDiv = section.closest("div");
      if (!parentDiv) return null;

      const height = parseInt(window.getComputedStyle(parentDiv).height);
      return isNaN(height) ? null : height;
    }
  });

  const currentHeight = results[0].result;
  if (currentHeight) {
    input.value = currentHeight;
  }
};

minusBtn.addEventListener("click", () => {
  const newHeight = Math.max(0, parseInt(input.value) - 50);
  input.value = newHeight;
  applyHeight(newHeight);
});

plusBtn.addEventListener("click", () => {
  const newHeight = parseInt(input.value) + 50;
  input.value = newHeight;
  applyHeight(newHeight);
});

applyBtn.addEventListener("click", () => {
  applyHeight(parseInt(input.value));
  window.close();
});

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    applyHeight(parseInt(input.value));
  }
});

// ⏱️ 팝업 열릴 때 현재 높이 반영
getCurrentHeight();