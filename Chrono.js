/**
 * React Chronometer
 */
var Chrono = React.createClass({
  //init
  getInitialState: function() {
    return {
      startTS: null,
      diff: null,
      suspended: 0,
      interval: null
    };
  },

  //po creatu
  componentDidMount: function() {
    window.addEventListener('keydown', this.onKeyDown);
  },

  //reakce na klavesy
  onKeyDown: function(evt){
    evt.preventDefault();
    // start|stop on [space]
    if (evt.keyCode === 32) {
        if (this.state.startTS) {
            this.stop();
        }
        else {
            this.start();
        }
    }

    // reset on [escape]
    if (evt.keyCode === 27) {
        this.reset();
    } 
  },

  //spusteni
  start: function(){
    if (this.state.startTS) {
      // prevent multi clicks on start
      return;
    }
    this.setState({
      startTS: +new Date() - this.state.suspended,
      interval: requestAnimationFrame(this.tick),
      suspended: 0
    });
  },

  //stopnuti
  stop: function(){
    cancelAnimationFrame(this.state.interval);
    this.setState({
      startTS: null,
      suspended: +this.state.diff
    });
  },

  //reset
  reset: function(){
    cancelAnimationFrame(this.state.interval);
    this.setState(this.getInitialState());
  },

  //jeden tik
  tick: function(){
    this.setState({
      diff: new Date(+new Date() - this.state.startTS),
      interval: requestAnimationFrame(this.tick)
    });
  },

  //nevim upa
  addZero: function(n){
    return n < 10 ? '0' + n : n;
  },

  render: function(){
    var diff = this.state.diff;
    var hundredths = diff ? Math.round(this.state.diff.getMilliseconds()/10) : 0;
    var seconds = diff ? this.state.diff.getSeconds() : 0;
    var minutes = diff ? this.state.diff.getMinutes() : 0;

    if (hundredths === 100) hundredths = 0;

    return (
      <section className="Chrono">
        <h1>{this.addZero(minutes)}:{this.addZero(seconds)}:{this.addZero(hundredths)}</h1>
        <div className="buttons">
          <button onClick={this.start}>START</button>
          <button onClick={this.stop}>STOP</button>
          <button onClick={this.reset}>RESET</button>
        </div>
      </section>
    )
  }

});


React.render(<Chrono />, document.body);
