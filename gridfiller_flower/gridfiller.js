let my_gridfiller;


//============================================================
function setup() {

  createCanvas(windowHeight, windowHeight);
  
  frameRate(1);
  this.size_pix = 50
  this.boxes = 3

  my_gridfiller = new gridfiller(this.size_pix, this.boxes )
  

  this.gui = new dat.GUI();
  this.gui.add(this, "size_pix", 50).step(1)
  this.gui.add(this, "boxes", 3).min(1).step(1)
  this.gui.add(this, "create")

}

function create() {
  console.log("create")
  my_gridfiller = new gridfiller(parseInt(this.size_pix), parseInt(this.boxes)  )


}



//============================================================
function draw() {
  console.log("draw")
  let canv_size ;
  if (windowWidth < windowHeight) {
    canv_size = windowWidth
  } else{
    canv_size = windowHeight 
  }
  my_gridfiller.draw(canv_size-20)

}


//============================================================
function windowResized() {
  resizeCanvas(windowHeight, windowHeight);
}

//============================================================
class gridfiller {
  constructor(ribbe, boxes) {
    this.ribbe = ribbe
    this.h_ribbe = ribbe/2
    this.q_ribbe = ribbe/4
    this.boxes = boxes

  }

  //-----------
  draw(size) {
    let middle = size*0.5
    background(255, 255, 255);

    stroke("black")
    strokeWeight(1)
    fill("yellow")
    for (let b = -this.boxes; b <= this.boxes; b++) { 
      let d = b*1.5*this.ribbe
      square(d+middle-this.h_ribbe, middle-this.h_ribbe, this.ribbe)
      square(middle-this.h_ribbe, d+middle-this.h_ribbe, this.ribbe)
    }

  for (quarter = 1; quarter <5; quarter ++) {
    let lr = -1, td = -1
    if (quarter < 3) lr = 1
    if (quarter == 2 || quarter == 3) td = 1
        for (let b = 0; b <= this.boxes; b++) {
          let px = lr*this.h_ribbe
          let py = -this.h_ribbe - b*1.5*this.ribbe
          draw_hook(px+middle, py+middle, this.ribbe, quarter, 1, "black","green")
        }
      }
    
  }
  

}

/**
 * draw line
 * 
 *     ----------
 *     |  4   1  |
 *     |    x----
 *     |  3 | (xy)(2)
 *     ------
 * 
 * @param {*} x 
 * @param {*} y 
 * @param {*} ribbe 
 * @param {*} quarter : which secion is cut 
 */
function draw_hook(x,y,ribbe,quarter,stoke_w,stoke_c,fill_c) {
  let h_ribbe = ribbe/2

  //FILLS
  noStroke()
  fill(fill_c)
  if(quarter!= 1) {
    square(x, y-h_ribbe, h_ribbe)
  }
  if(quarter!= 2) {
    square(x, y, h_ribbe)
  }
  if(quarter!= 3) {
    square(x-h_ribbe, y, h_ribbe)
  }
  if(quarter!= 4) {
    square(x-h_ribbe, y-h_ribbe, h_ribbe)
  }

  //EDGES
  strokeWeight(stoke_w)
  stroke(stoke_c)
  if(quarter!= 1) {
    line(x,y-h_ribbe, x+h_ribbe, y-h_ribbe) 
    line(x+h_ribbe,y-h_ribbe, x+h_ribbe, y) 
    } else {
    line(x, y-h_ribbe,x,y)  
    line(x,y,x+h_ribbe,y)
  }
  if(quarter!= 2) {
    line(x+h_ribbe,y,x+h_ribbe,y+h_ribbe)
    line(x+h_ribbe,y+h_ribbe,x, y+h_ribbe)
  } else {
    line(x,y,x+h_ribbe,y)
    line(x,y,x,y+h_ribbe)
  }

  if(quarter!= 3) {
    line(x-h_ribbe,y,x-h_ribbe, y+h_ribbe)
    line(x-h_ribbe,y+h_ribbe,x, y+h_ribbe)
  } else {
    line(x-h_ribbe,y,x,y)
    line(x,y,x,y+h_ribbe)
  }

  if(quarter!= 4) {
    line(x-h_ribbe,y, x-h_ribbe, y-h_ribbe)
    line(x-h_ribbe,y-h_ribbe,x, y-h_ribbe)
  } else {
    line(x-h_ribbey, x, y)
    line(x,y,x, y-h_ribbe)
      
  }

}

