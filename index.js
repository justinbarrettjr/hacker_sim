let windows = []
let mouse = {x: 0, y: 0}
let window_z = 1

document.addEventListener("keydown", function(e) {
  if(e.ctrlKey && e.altKey && e.key == 't'){
    openWindow()
  }
})

document.addEventListener("mousemove", function(e){ 
  mouse = { x: e.clientX, y: e.clientY }
  document.body.style.cursor = 'default'

  windows.forEach(x => {
    // Check Resize Sections
    const BUFFER = 8
    if(!x.drag.active){
      if(mouse.x > x.state.x && mouse.x < x.state.x+x.state.width && mouse.y > x.state.y && mouse.y < x.state.y+x.state.height){
        let direction = ''
        if(mouse.y < x.state.y+BUFFER) direction += 'n'
        else if(mouse.y > x.state.y+x.state.height-BUFFER) direction += 's'
        if(mouse.x < x.state.x+BUFFER) direction += 'w'
        else if(mouse.x > x.state.x+x.state.width-BUFFER) direction += 'e'

        x.drag.resize = direction
        if(direction != '') document.body.style.cursor = `${direction}-resize`
        else document.body.style.cursor = 'default'
      }
    }
    
    // Drag Window
    else{
      if(x.drag.resize == ''){
        x.setState({x: mouse.x-x.drag.x})
        x.setState({y: mouse.y-x.drag.y})
      }else{
        const MIN_WINDOW_WIDTH = 200
        const MIN_WINDOW_HEIGHT = 200
        if(x.drag.resize.match('e') != null){
          let new_width = mouse.x-x.state.x
          if(new_width < MIN_WINDOW_WIDTH) new_width = MIN_WINDOW_WIDTH
          x.setState({width: new_width})
        }else if(x.drag.resize.match('w') != null){
          let new_x = mouse.x
          if(new_x > x.drag.ix + x.drag.width - MIN_WINDOW_WIDTH) new_x = x.drag.ix + x.drag.width - MIN_WINDOW_WIDTH
          let new_width = x.drag.width + x.drag.ix-mouse.x
          if(new_width < MIN_WINDOW_WIDTH) new_width = MIN_WINDOW_WIDTH
          x.setState({
            x: new_x,
            width: new_width
          })
        }
        if(x.drag.resize.match('n') != null) {
          let new_height = x.drag.height + x.drag.iy-mouse.y
          if(new_height < MIN_WINDOW_HEIGHT) new_height = MIN_WINDOW_HEIGHT
          let new_y = mouse.y
          if(new_y > x.drag.iy + x.drag.height - MIN_WINDOW_HEIGHT) new_y = x.drag.iy + x.drag.height - MIN_WINDOW_HEIGHT
          x.setState({
            y: new_y,
            height: new_height
          })
        }else if(x.drag.resize.match('s') != null) {

          let new_height = mouse.y-x.state.y
          if(new_height < MIN_WINDOW_HEIGHT) new_height = MIN_WINDOW_HEIGHT
          x.setState({height: new_height})
        }
      }
      if(e.buttons == 0) x.end_drag()
    }
  })
})

class Windo extends React.Component { 
  constructor(props) {
    super(props)
    this.state = {
      width: 500,
      height: 300,
      x: 0,
      y: 0,
      dargging: false
    }
    this.id = windows.length
    windows.push(this)
    this.drag = { active: false, x: 0, y: 0, resize: '' }
    this.start_drag = this.start_drag.bind(this)
    this.end_drag = this.end_drag.bind(this)
    this.close = this.close.bind(this)
  }

  start_drag(e) {
    if(e.target.classList[0] == 'header' || this.drag.resize != ''){
      this.setState({dragging: true})
      this.drag.active = true
      this.drag.x = mouse.x - this.state.x
      this.drag.y = mouse.y - this.state.y
      this.drag.iy = this.state.y
      this.drag.ix = this.state.x
      this.drag.width = this.state.width
      this.drag.height = this.state.height
    }
  }

  end_drag() {
    this.setState({dragging: false})
    this.drag.active = false
    this.drag.resize = ''
  }

  close() {
    
  }
  
  render() { 
    let style = {
      width: this.state.width,
      height: this.state.height,
      left: this.state.x,
      top: this.state.y
    }

    let frame_style = {
      height: this.state.height-30,
      width: this.state.width-10
    }

    let disp = 'none'
    if(this.state.dragging) disp = 'block'

    let buffer_style = {
      height: this.state.height-20,
      width: this.state.width,
      display: disp,
      position: 'absolute'
    }

    return (
      <div style={style} class='window' onMouseDown={this.start_drag}>
        <div class='header'>
          <div class='left'>
            <img src="https://cdn.osxdaily.com/wp-content/uploads/2013/10/terminal-icon-osx.png" />
          </div>
          {this.props.title}
          <div class='right'>
            <button><i class="fa-solid fa-minus"></i></button>
            <button><i class="fa-regular fa-square"></i></button>
            <button class='blue' onClick={this.close}><i class="fa-solid fa-xmark"></i></button>
          </div>
        </div>
        <div style={buffer_style}></div>
        <iframe src='apps/terminal' style={frame_style}></iframe>
      </div>
    );
  } 
}


function openWindow() {
  ReactDOM.render(
    <div>
    <Windo title="Terminal"/>
    </div>,
    document.body
  )
}

openWindow()