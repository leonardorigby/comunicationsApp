$(document).ready(function() {
  getMiniCartItems();
  // add alert start
  $(".box-product .box-btn .btn-add-buy-button-asynchronous").click(function() {
    $(".section-alert").css({
      "right": "30px"
    });

    setTimeout(function() {
      getMiniCartItems();
      $(".section-alert").css({
        "right": "-1000px"
      });
    }, 3000);

  });
  // add alert end

  // full banners slider start
  var swiper = new Swiper('.swiper-container-fullBanner', {
    pagination: {
      el: '.swiper-pagination-fullBanner',
      clickable: true,
    },
    autoplay: {
      delay: 3600,
      disableOnInteraction: false,
    },
    loop: true,
  });
  // full banners slider end

  // ofertas de la semana start
  $(".box-productos ul li").addClass("box-6");
  // ofertas de la semana end

  // most requested start
  $(".section-mostRequested .swiper-container").addClass("swiper-container-mostRequested");
  $(".swiper-container-mostRequested ul").addClass("swiper-wrapper");
  $(".swiper-container-mostRequested ul li").addClass("swiper-slide");
  $(".swiper-container-mostRequested").append($(".swiper-pagination-mostRequested"));
  $(".swiper-container-mostRequested").append($(".next-mostRequested"));
  $(".swiper-container-mostRequested").append($(".prev-mostRequested"));
  $(".box-product .box-btn a").text("AGREGAR");


  var swiper = new Swiper('.swiper-container-mostRequested', {
    slidesPerView: 5,
    slidesPerGroup: 5,
    spaceBetween: 0,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    // autoplay: {
    //  delay: 3000,
    //  disableOnInteraction: false,
    // },
    // loop: true,
    // init: false,
    pagination: {
      el: '.swiper-pagination-mostRequested',
      clickable: true,
    },
    breakpoints: {
      1250.98: {
        slidesPerView: 5,
        slidesPerGroup: 5,
        spaceBetween: 10,
      },
      1199.98: {
        slidesPerView: 4,
        slidesPerGroup: 4,
        spaceBetween: 10,
      },
      1099.98: {
        slidesPerView: 4,
        slidesPerGroup: 4,
        spaceBetween: 10,
      },
      999.98: {
        slidesPerView: 4,
        slidesPerGroup: 4,
        spaceBetween: 10,
      },
      899.98: {
        slidesPerView: 4,
        slidesPerGroup: 4,
        spaceBetween: 10,
      },
      849.98: {
        slidesPerView: 3,
        slidesPerGroup: 3,
        spaceBetween: 10,
      },
      799.98: {
        slidesPerView: 3,
        slidesPerGroup: 3,
        spaceBetween: 10,
      },
      639.98: {
        slidesPerView: 3,
        slidesPerGroup: 3,
        spaceBetween: 10,
      },
      527.98: {
        slidesPerView: 2,
        slidesPerGroup: 2,
        spaceBetween: 10,
      },
      464.98: {
        slidesPerView: 1,
        slidesPerGroup: 1,
        spaceBetween: 10,
      },
      320.98: {
        slidesPerView: 1,
        slidesPerGroup: 1,
        spaceBetween: 10,
      },
      220.98: {
        slidesPerView: 1,
        slidesPerGroup: 1,
        spaceBetween: 10,
      },
      120.98: {
        slidesPerView: 1,
        slidesPerGroup: 1,
        spaceBetween: 10,
      }
    }
  });
  // most requested end

  // most requested 2 start
  $(".section-mostRequested-2 .swiper-container").addClass("swiper-container-mostRequested-2");
  $(".swiper-container-mostRequested-2 ul").addClass("swiper-wrapper");
  $(".swiper-container-mostRequested-2 ul li").addClass("swiper-slide");
  $(".swiper-container-mostRequested-2").append($(".swiper-pagination-mostRequested-2"));
  $(".swiper-container-mostRequested-2").append($(".next-mostRequested-2"));
  $(".swiper-container-mostRequested-2").append($(".prev-mostRequested-2"));
  $(".box-product .box-btn a").text("AGREGAR");


  var swiper = new Swiper('.swiper-container-mostRequested-2', {
    slidesPerView: 5,
    slidesPerGroup: 5,
    spaceBetween: 5,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    // autoplay: {
    //  delay: 3000,
    //  disableOnInteraction: false,
    // },
    // loop: true,
    // init: false,
    pagination: {
      el: '.swiper-pagination-mostRequested-2',
      clickable: true,
    },
    breakpoints: {
      1250.98: {
        slidesPerView: 5,
        slidesPerGroup: 5,
        spaceBetween: 10,
      },
      1199.98: {
        slidesPerView: 4,
        slidesPerGroup: 4,
        spaceBetween: 10,
      },
      1099.98: {
        slidesPerView: 4,
        slidesPerGroup: 4,
        spaceBetween: 10,
      },
      999.98: {
        slidesPerView: 4,
        slidesPerGroup: 4,
        spaceBetween: 10,
      },
      899.98: {
        slidesPerView: 4,
        slidesPerGroup: 4,
        spaceBetween: 10,
      },
      849.98: {
        slidesPerView: 3,
        slidesPerGroup: 3,
        spaceBetween: 10,
      },
      799.98: {
        slidesPerView: 3,
        slidesPerGroup: 3,
        spaceBetween: 10,
      },
      639.98: {
        slidesPerView: 3,
        slidesPerGroup: 3,
        spaceBetween: 10,
      },
      527.98: {
        slidesPerView: 2,
        slidesPerGroup: 2,
        spaceBetween: 10,
      },
      464.98: {
        slidesPerView: 1,
        slidesPerGroup: 1,
        spaceBetween: 10,
      },
      320.98: {
        slidesPerView: 1,
        slidesPerGroup: 1,
        spaceBetween: 10,
      },
      220.98: {
        slidesPerView: 1,
        slidesPerGroup: 1,
        spaceBetween: 10,
      },
      120.98: {
        slidesPerView: 1,
        slidesPerGroup: 1,
        spaceBetween: 10,
      }
    }
  });
  // most requested 2 end
});

function getMiniCartItems() {
  console.log("mini cart items");
  var itemInfo = "";
  var qtyCart = $(".mini-cart-qty-admake").text();
  var totalItems = parseInt(qtyCart);

  vtexjs.checkout.getOrderForm().done(function(orderForm) {
    // console.log("Order Form: "+ orderForm);
    var itemsQuantity = orderForm.items.length;

    if (totalItems != itemsQuantity) {
      console.log("se agrego item con exito!");
    } else {
      console.log("no se agrego item!");
    }

    $(".mini-cart-qty-admake").text(itemsQuantity);
    if (orderForm.items.length > 0) {
      var totalPrice = 0;

      orderForm.items.forEach(function(elemento, index) {

        var formatPrice = (elemento.price/100).toFixed(2);

        itemInfo += "<div class='box-flex'>" +
          "<div class='mini-bolsa-item'><a href=" + elemento.detailUrl + "><img src=" + elemento.imageUrl + "/></a></div>" +
          "<div class='mini-bolsa-item'><a href=" + elemento.detailUrl + ">" + elemento.skuName + "</a></div>" +
          "<div class='mini-bolsa-item'>" +
          "<i class='fas fa-minus' onclick='updateItem("+index +","+ elemento.quantity +","+'"restar"' +")'></i>"+
          "<input type='text' readonly='readonly' class='qty-input' value="+ elemento.quantity +" />"+
          "<i class='fas fa-plus' onclick='updateItem("+index +","+ elemento.quantity +","+'"sumar"' +")'></i></div>"+
          "<div class='mini-bolsa-item'> $ " + formatPrice + "</div>" +
          "<div class='mini-bolsa-item'><i class='far fa-trash-alt' onclick ='removeItem(" + index + ")' title='remove'></i></div>" +
          "</div>";

          totalPrice += parseFloat(formatPrice);
      });
      $("#totalPrice").html(totalPrice);
      $("#mini-bolsa").html(itemInfo);
    } else {
      console.log("empty items!");
      itemInfo = "";
      $("#mini-bolsa").html(itemInfo);
      totalPrice = 0;
      $("#totalPrice").html(totalPrice);
    }
  });
}

function updateItem(itemIndex, itemQuantity, operation){
    if(operation=='restar'){
      itemQuantity--;

      vtexjs.checkout.getOrderForm( ).then( function( orderForm )  {
        // var  itemIndex  =  0 ;
        var  item  =  orderForm.items[ itemIndex ] ;
        var  updateItem  =  {
          index : itemIndex ,
          quantity : itemQuantity
        } ;
        return  vtexjs.checkout.updateItems( [updateItem ] ,  null ,  false ) ;
      }).done ( function ( orderForm )  {
        getMiniCartItems();
      }) ;

    }else if(operation=='sumar'){
      itemQuantity++;

      vtexjs.checkout.getOrderForm( ).then( function( orderForm )  {
        // var  itemIndex  =  0 ;
        var  item  =  orderForm.items[ itemIndex ] ;
        var  updateItem  =  {
          index : itemIndex ,
          quantity : itemQuantity
        } ;
        return  vtexjs.checkout.updateItems( [updateItem ] ,  null ,  false ) ;
      }).done ( function ( orderForm )  {
        getMiniCartItems();
      }) ;
    }
}

function removeItem(itemIndex){
  vtexjs.checkout.getOrderForm( ).then ( function( orderForm )  {
    // var  itemIndex  =  0
    var  item  =  orderForm . items [ itemIndex ] ;
    var  itemsToRemove  =  [{
        "index" : itemIndex,
        "quantity" : 0 ,
      }
    ]
    return  vtexjs.checkout.removeItems (itemsToRemove ) ;
  } )
  .done( function( orderForm )  {
    getMiniCartItems();
  } ) ;
}
