const lerp = (a, b, n) => {
  return (1 - n) * a + n * b;
};

const isEqual = (a, b) => {
  if(!a || !b) return false;
  return Math.abs(a.x - b.x) < 0.1 && Math.abs(a.y - b.y) < 0.1;
};

const getStyle = (el, attr) => {
  return parseInt(window.getComputedStyle(el)[attr]);
};

const cursorInit = () => {
  new Cursor();
};

class Cursor {
  constructor() {
    this.pos = {
      curr: null,
      prev: null
    };
    this.pt = [];
    this.create();
    this.init();
    this.render();
  }

  move(left, top) {
    this.cursor.style.left = `${left}px`;
    this.cursor.style.top = `${top}px`;
  }

  create() {
    if(!this.cursor) {
      this.cursor = document.createElement("div");
      this.cursor.className = "cursor";
      this.cursor.classList.add("hidden");
      document.body.appendChild(this.cursor);
    }

    var el = document.getElementsByTagName('*');
    for(let i = 0; i < el.length; i++)
      if(getStyle(el[i], "cursor") === "pointer")
        this.pt.push(el[i]);

    document.body.appendChild((this.scr = document.createElement("style")));
    const svgUrl = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' " +
                   "viewBox='0 0 8 8' width='10px' height='10px'>" +
                   "<circle cx='4' cy='4' r='4' fill='white' /></svg>";
    this.scr.innerHTML = `* {cursor: url("${svgUrl}") 4 4, auto !important}`;
  }

  refresh() {
    this.scr.remove();
    this.cursor.classList.remove("active");
    this.pos = {
      curr: null,
      prev: null
    };
    this.pt = [];

    this.create();
    this.init();
    this.render();
  }

  init() {
    document.onmousemove = (e) => {
      this.pos.curr === null && this.move(e.clientX - 8, e.clientY - 8);
      this.pos.curr = {
        x: e.clientX - 8,
        y: e.clientY - 8
      };
      this.cursor.classList.remove("hidden");
      this.render();
    };
    document.onmouseenter = () => this.cursor.classList.remove("hidden");
    document.onmouseleave = () => this.cursor.classList.add("hidden");
    document.onmousedown = () => this.cursor.classList.add("active");
    document.onmouseup = () => this.cursor.classList.remove("active");
  }

  render() {
    if(this.pos.curr && this.pos.prev) {
      this.pos.prev.x = lerp(this.pos.prev.x, this.pos.curr.x, 0.35);
      this.pos.prev.y = lerp(this.pos.prev.y, this.pos.curr.y, 0.35);
      this.move(this.pos.prev.x, this.pos.prev.y);
    } else if(this.pos.curr) {
      this.pos.prev = this.pos.curr;
    }
    if(this.pos.curr && this.pos.prev && !isEqual(this.pos.curr, this.pos.prev)) {
      requestAnimationFrame(() => this.render());
    }
  }
}

export default cursorInit;
