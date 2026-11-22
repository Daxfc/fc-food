export function navigateWithLoader(href: string) {
    if (typeof window === "undefined") return;
    const currentPath = window.location.pathname;
    const targetPath = href.split("?")[0].split("#")[0];
  
    if (currentPath === targetPath) return;
  
    const link = document.createElement("a");
    link.href = href;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }