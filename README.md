# Shopify-addtocart-on-quantity-change

#Add the following code in the product loop....

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

