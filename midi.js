navigator.requestMIDIAccess().then(onMIDISuccess,onMIDIFailure);
var midi = null;
var inputs = [];
var outputs = [];

function onMIDISuccess(m){
   console.log( "MIDI ready!" );
  midi = m;
  var it = midi.inputs.values();
  for(var o = it.next(); !o.done; o = it.next()){
    inputs.push(o.value);
  }
  var ot = midi.outputs.values();
  for(var o = ot.next(); !o.done; o = ot.next()){
    outputs.push(o.value);
  }

  for(var cnt=0;cnt < inputs.length;cnt++){
    inputs[cnt].onmidimessage = onMIDIEvent;
  }

}

function onMIDIFailure(msg) {
  console.log( "Failed to get MIDI access - " + msg );
}

function onMIDIEvent(e){
  if(e.data[2] != 0){
    // なにかをうけとったときの処理
  }
}
function sendMIDINoteOn(note){
  if(outputs.length > 0){
    outputs[0].send([0x90,note,0x7f]);
  }
}
function sendMiddleC( portID ) {
  var noteOnMessage = [0x90, 60, 0x7f];    // note on, middle C, full velocity
  outputs[portID].send(noteOnMessage);
  outputs[portID].send( [0x80, 60, 0x40], window.performance.now() + 1000.0 ); // インライン配列作成 - ノートオフ, 中央C,

  //output.send( noteOnMessage );  //omitting the timestamp means send immediately.
  //output.send( [0x80, 60, 0x40], window.performance.now() + 1000.0 ); // インライン配列作成 - ノートオフ, 中央C,
                                                                      // リリースベロシティ = 64, タイムスタンプ = now + 1000ms.
}
