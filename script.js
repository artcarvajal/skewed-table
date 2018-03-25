/********************************/
/*                              */
/*       Global Variables       */
/*                              */
/********************************/

let shiftDown = false;
let ctrlDown = false;
let lastSelectedIndex = null;

/********************************/
/*                              */
/*       Global Listeners       */
/*                              */
/********************************/

// on touch devices, forces individual cell select/deselect
window.addEventListener('touchstart', ()=>{ ctrlDown = true; });

// modifier key listeners
window.addEventListener('keydown', function(e){
  if (e.keyCode == 17) { ctrlDown = true; }
  if (e.keyCode == 16) { shiftDown = true; }
});
window.addEventListener('keyup', function(e){
  if (e.keyCode == 17) { ctrlDown = false; }
  if (e.keyCode == 16) { shiftDown = false; }
});

// deselect all elements when the user clicks off of the grid
$(document).click(function(e){
  if (!$(e.target).is('td')) {
    $('td.selected').removeClass('selected');
  }
});

/*********************************/
/*                               */
/*       Element Listeners       */
/*                               */
/*********************************/

// control for swapping options
$('.option').click(function(){
  $('table')[0].id = this.id;
  $('.option.selected').removeClass('selected');
  $(this).addClass('selected');
  
  // reset the grid on choosing a new hover effect
  $('td.selected').removeClass('selected');
});

// listen for clicks on any td (main logic: clickFunction)
$('td').click(clickFunction);

/*************************/
/*                       */
/*       Functions       */
/*                       */
/*************************/

function clickFunction (e){
  // store the current selected cell's index
  let thisIndex = $('td').index(this);
  
  // always remove the deselected class and unbind listeners
  $('.deselected').removeClass('deselected').off('mouseout');
  
  // if clicking on a selected element, deselect it
  if ($(e.target).hasClass('selected')) {
    // the deselected class preserves the expected cell styling,
    // but also clearly shows when a cell has been deselected
    $(this).removeClass('selected').addClass('deselected');
    
    // add a listener to the deselected element
    $(this).mouseout(function(){
      $(this).removeClass('deselected').off('mouseout');
    })
    
    lastSelectedIndex = thisIndex;
    return;
  }
  
  // if no modifiers are held down, deselect all other cells, and null out the last selected
  if (!ctrlDown && !shiftDown) {
    $('td.selected').removeClass('selected');
  }
  
  // the shift modifier selects all cells from the last selected to this selection
  if (shiftDown && lastSelectedIndex !== null) {
    $('td').filter((ind)=>{
      return (ind >= Math.min(lastSelectedIndex, thisIndex) && ind <= Math.max(lastSelectedIndex, thisIndex));
    }).addClass('selected');
  }
  
  $(this).addClass('selected');
  lastSelectedIndex = thisIndex;
}