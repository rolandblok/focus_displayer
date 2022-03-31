let my_gridfiller;


//============================================================
function setup() {

  createCanvas(windowHeight, windowHeight);
  
  frameRate(1);
  this.base = 3
  this.inner = 3

  my_gridfiller = new gridfiller(this.base, this.inner )
  

  this.gui = new dat.GUI();
  this.gui.add(this, "base", [3, 4, 5])
  this.gui.add(this, "inner", [3, 4, 5])
  this.gui.add(this, "create")

}

function create() {
  console.log("create")
  my_gridfiller = new gridfiller(parseInt(this.base), parseInt(this.inner)  )
  //iterations = my_gridfiller.solve();


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
  constructor(base, inner) {
    this.base = base
    this.inner = inner
    this.base_depth = base*base;
    this.inner_depth = inner*inner;
    this.no_rows = base * inner
    this.no_cols = base * inner
    this.cell_cnt = this.base_depth*this.inner_depth;


    // create all cells
    this.cells = new Array(this.no_rows)
    this.cells_all = new Array(this.cell_cnt)
    for (let r = 0; r < this.no_rows; r++) {
      this.cells[r] = new Array(this.no_rows)
      for ( let c = 0; c < this.no_cols ; c++) {
        this.cells[r][c] = new Cell(r,c);
        this.cells_all[r*this.no_rows + c] = this.cells[r][c]
      }
    }

    //create line fields (arrays of cells)
    for (let r = 0 ; r < this.no_rows; r++){
      let field = new Field("column")
      for ( let c = 0; c < this.no_cols ; c++) {
        field.addCell(this.cells[r][c])
        this.cells[r][c].addField(field)
      }
    }
    for (let c = 0 ; c < this.no_cols; c++){
      let field = new Field("row")
      for ( let r = 0; r < this.no_cols ; r++) {
        field.addCell(this.cells[r][c])
        this.cells[r][c].addField(field)
      }
    }
    let square_fields = []
    let colors1 = [[color("red"), color("blue"), color("green")],
                  [color("yellow"), color("magenta"), color("cyan")],
                  [color("white"), color("purple"), color("orange")]];
    let field_colors = []
    for ( let fr = 0; fr < this.base; fr ++) {
      let f_col_row = [] 
      for ( let fc = 0; fc < this.base; fc ++) {
        if ( (fr < colors1.length) && (fc < colors1[fr].length) ) {
          f_col_row.push(colors1[fr][fc])
        } else {
          f_col_row.push(color(random(255), random(255), random(255)))
        }
      }
      field_colors.push(f_col_row)
    }

    // Create the sudoku fields: There are 9 when your base is 3.
    for (let fi = 0; fi < this.base; fi++) {
      for (let fj = 0; fj < this.base; fj++) {
        let field = new Field("square", field_colors[fi][fj])
        square_fields.push(field);
        for (let r = fi*this.inner; r < fi*this.inner+this.inner; r++) {
          for (let c = fj*this.inner; c < fj*this.inner+this.inner; c++) {
            field.addCell(this.cells[r][c])
            this.cells[r][c].addField(field)
          }
        }
      }
    }

    if (true) {
      console.log("jigsaw")
      for (let i = 0 ; i < 100; i ++) {
        let r =  Math.floor(random(0, this.no_rows))
        let c =  Math.floor(random(0, this.no_cols))

        let cell_a = this.cells[r][c];
        for (const cell_c of this.cells_all) {
          if (cell_a != cell_c) {
            if((cell_c.r == 3 ) && (cell_c.c == 1))
            {
              console.log("debug")
            }
            if (cell_a.fields["square"] != cell_c.fields["square"]) {
              this.swapField ( cell_a, cell_c)
              
              if (!this.isValidField(cell_a) || !this.isValidField(cell_c) ) {
                this.swapField ( cell_a, cell_c)
              } else {
                break // swap was succes, next cell
              }
            }
          }
        }
      }



    }

  }

  //-----------
  draw(size) {
    background(255, 255, 255);

    // first cells
    let base_w = size / this.base
    let cell_h = size / this.no_rows
    let cell_w = size / this.no_cols
    let f_size = cell_w/2
    textSize(f_size)
    textAlign(CENTER, CENTER);
    for (let r = 0 ; r < this.no_rows; r++) {
      for ( let c = 0; c < this.no_cols ; c++) {
        strokeWeight(0)
        fill(this.cells[r][c].color())
        rect(r*cell_w, c*cell_h, cell_w, cell_h)
        fill("black")
        let x = (r+0.5) * cell_w
        let y = (c+0.5) * cell_h
        text(this.cells[r][c].toString(), x, y )
      }
    }

    // lines afterwards
    stroke("black")
    if(!this.jigsaw) {
      for (let l = 1 ; l < this.base; l++){
        let x = base_w * l
        strokeWeight(5)
        line(0, x, size, x);
        line(x, 0, x, size);
      }
    }
    for (let r = 1 ; r < this.no_rows; r++){
      let x = cell_h * r
      strokeWeight(1)
      line(0, x, size, x);
      line(x, 0, x, size);
    }
    for (let c = 1 ; c < this.no_cols; c++){
      let x = cell_w * c
      strokeWeight(1)
      line(0, x, size, x);
      line(x, 0, x, size);
    }
  }

  
  //
  getNeighbours(cell) {
    let neighbours = [] 
    if (cell.r > 0) {
      neighbours.push(this.cells[cell.r-1][cell.c])
    }
    if (cell.r < (this.no_rows-1)) {
      neighbours.push(this.cells[cell.r+1][cell.c])
    }
    if (cell.c > 0) {
      neighbours.push(this.cells[cell.r][cell.c-1])
    }
    if (cell.c < (this.no_cols-1)) {
      neighbours.push(this.cells[cell.r][cell.c+1])
    }
    return neighbours
  }

  //
  isValidField(cell){
    let field_neighbours = new Set();
    this.addFieldNeighbours(field_neighbours, cell)
    return (field_neighbours.size == this.inner_depth) 
  }
  addFieldNeighbours(field_neighbours, cell) {
    let neighbours = this.getNeighbours(cell)
    for (let neighbour of neighbours) {
      if ((!field_neighbours.has(neighbour)) && (neighbour.fields["square"] == cell.fields["square"])) {
        field_neighbours.add(neighbour)
        this.addFieldNeighbours(field_neighbours, neighbour)
      }
    }
  }

  //swap square field cell
  swapField(cell_a, cell_b) {
    let sq_field_a = cell_a.fields["square"]
    let sq_field_b = cell_b.fields["square"]
    cell_a.fields["square"] = sq_field_b
    cell_b.fields["square"] = sq_field_a
    sq_field_a.addCell(cell_b)
    sq_field_a.deleteCell(cell_a)
    sq_field_b.addCell(cell_a)
    sq_field_b.deleteCell(cell_b)
  }


}

class Field {
  constructor(label, color) {
    this.cells = new Set();
    this.label = label
    this.color = color
  }
  addCell(cell) {
    this.cells.add(cell)
  }
  deleteCell(cell) {
    this.cells.delete(cell)
  }

}

//============================================================
class Cell {
  constructor (r, c){
    this.value = 0;
    this.r = r;
    this.c = c;
    this.fields = {}
  }

  //-----------
  addField(field) {
    this.fields[field.label] = field
  }
  
  //-----------
  clear() {
    this.value = 0;
  }

  
  color() {
    let kleur = color(this.fields["square"].color)
    if ("nrc" in this.fields) {
      kleur = color("grey")
    }
    return kleur
  }

  //-----------
  toString() {
    if (this.value == 0) {
      return "."
    } else {
      return "" + this.value
    }
  }

  //compare
  compare(cell) {
    if(cell.r != this.r) {
      return cell.r - this.r
    } else {
      return cell.c - this.c
    }
  }
}

//============================================================
function arrayShuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
