/*

{% assign lineval = 0 %}
{% for line_item in cart.items %}
  {% if line_item.variant_id == variantid.id %}
    {% assign lineval = line_item.quantity %}
  {% endif %}
{% endfor %}
 
<div class="cart-quantity">
  <input type='button' value='-' class='qtyminus' field='addcart_{{ variantid.id }}' />
  <input type="number" name="updates[]" id="addcart_{{ variantid.id }}" class="quantity" value="{{lineval}}" />
  <input type='button' value='+' class='qtyplus' field='addcart_{{ variantid.id }}' />
</div>
<div class="continue_shopping animated fadeInUp" id="text_{{ variantid.id }}" style="display: none;">
  <a href="javascript:void(0);" class="close cls_msg">Continue Shopping</a> or <a href="/cart">View Cart</a>
</div>

*/


jQuery(document).ready(function(){
  // This button will increment the value
  $('.qtyplus').click(function(e){
    // Stop acting like a button
    e.preventDefault();
    // Get the field name
    fieldName = $(this).attr('field');
    // Get its current value
    var currentVal = parseInt($('input[id='+fieldName+']').val());    
    // If is not undefined
    if (!isNaN(currentVal)) {
      // Increment
      $('input[id='+fieldName+']').val(currentVal + 1);
      var cartVal = parseInt($('input[id='+fieldName+']').val());
      var prodid = fieldName.split('_');
      addtocart(cartVal,prodid[1]);
    } else {
      // Otherwise put a 0 there
      $('input[id='+fieldName+']').val(0);
    }
  });
  // This button will decrement the value till 0
  $(".qtyminus").click(function(e) {
    // Stop acting like a button
    e.preventDefault();
    // Get the field name
    var fieldName = $(this).attr('field');    
    // Get its current value
    var currentVal = parseInt($('input[id='+fieldName+']').val());    
    // If it isn't undefined or its greater than 0
    if (!isNaN(currentVal) && currentVal > 0) {
      // Decrement one
      $('input[id='+fieldName+']').val(currentVal - 1);
      var cartVal = parseInt($('input[id='+fieldName+']').val());
      var prodid = fieldName.split('_');
      removefromcart(cartVal,prodid[1]);
    } else {
      // Otherwise put a 0 there
      $('input[id='+fieldName+']').val(0);
    }
  });
  
  $('.cls_msg').click(function(){
    $('.continue_shopping').hide();
  });
  
});  


function addtocart(cartVal,prodid){  
  Shopify.queue = [];    
  Shopify.queue.push({
    variantId: prodid,
    variantQty: cartVal,
  });  

  Shopify.moveAlong = function() {    
    if (Shopify.queue.length) {
      var request = Shopify.queue.shift();      
      $.ajax({
        type: 'POST',
        url: '/cart/add.js',
        dataType: 'json',
        data: {quantity: 1, id: request.variantId},
        success: function(res){
          Shopify.moveAlong();
          $.getJSON( "/cart.js", function( data ) {
            console.log(data);
            $('.continue_shopping').hide();
            $('#text_'+request.variantId).show();
            $('.cart_button span.cart_count').remove();
            $('.cart_button').append('<span class="cart_count"> ('+data.item_count+')</span>');
          });          
        },
        error: function(){          
          if (Shopify.queue.length){
            Shopify.moveAlong()
          } else {            
            $('#text_'+request.variantId).hide();          	
          }
        }
      });
    }   
  };
  Shopify.moveAlong();
};

function removefromcart(qty,prodid){  console.log('qty1:'+qty);
  /*if (qty <= 1){
    qty = 0;
  }else{
    qty = qty;
  }*/
  console.log('qty2:'+qty);
  var params = {
    type: 'POST',
    url: '/cart/change.js',
    data: 'quantity=' + qty + '&id=' + prodid,
    dataType: 'json',
    success: function(cartdata) { 
      $('.continue_shopping').hide();
      $('#text_'+prodid).show();
      $('.cart_button span.cart_count').remove();
      $('.cart_button').append('<span class="cart_count"> ('+cartdata.item_count+')</span>');
    }
  };
  $.ajax(params);
}
