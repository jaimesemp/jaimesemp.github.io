/* Plugin Name: socialShare Version: 1.0 Plugin URI: https://github.com/tolgaergin/social
Description: To share any page with 46 icons 
Author: Tolga Ergin
Author URI: http://tolgaergin.com
Designer: Gökhun Güneyhan
Designer URI: http://gokhunguneyhan.com
*/
(function($){
  $.fn.extend({

    socialShare: function(options) {

      var defaults = {
        social: '',
        title: document.title,
        shareUrl: window.location.href,
        description: $('meta[name="description"]').attr('content'),
        animation: 'launchpad', // launchpad, launchpadReverse, slideTop, slideRight, slideBottom, slideLeft, chain
        chainAnimationSpeed: 100,
        whenSelect: false,
        selectContainer: 'body',
        blur: false
      };

      var options = $.extend(true,defaults, options);

      var beforeDivs = '<div class="arthref arthrefSocialShare"><div class="overlay '+options.animation+'"><div class="icon-container"><div class="centered"><ul>';
      var afterDivs = '</ul></div></div></div></div>';


      return this.each(function() {
          var o = options;
          var obj = $(this);

          if(o.whenSelect) {
            $(o.selectContainer).mouseup(function(e) {
              var selection = getSelected();
              if(selection && (selection = new String(selection).replace(/^\s+|\s+$/g,''))) {
                options.title = selection;
              }
            });
          }

          obj.click(function() {
            createContainer();
            if(o.blur) { $('.arthrefSocialShare').find('.overlay').addClass('opaque'); $('body').children().not('.arthref, script').addClass('blurred'); }
            $('.arthrefSocialShare').find('.overlay').css('display','block');
            setTimeout(function(){
              $('.arthrefSocialShare').find('.overlay').addClass('active');
              $('.arthrefSocialShare').find('ul').addClass('active');
              if(o.animation=='chain') chainAnimation($('.arthrefSocialShare').find('li'),o.chainAnimationSpeed,'1');
            },0);
          });

          $( document ).on( "click touchstart", ".arthrefSocialShare .overlay", function( e ) {
            destroyContainer(o);
          });

          $( document ).on( "keydown", function( e ) {
            if( e.keyCode == 27 ) destroyContainer(o);
          });

          $( document ).on( "click touchstart", ".arthrefSocialShare li", function( e ) {
            e.stopPropagation();
          });

      });

      function getSelected() {
        if(window.getSelection) { return window.getSelection(); }
        else if(document.getSelection) { return document.getSelection(); }
        else {
          var selection = document.selection && document.selection.createRange();
          if(selection.text) { return selection.text; }
            return false;
        }
        return false;
      };

      function chainAnimation(e,s,o) {
        var $fade = $(e);
        $fade.each(function( i ){
            $(this).delay(i * s).fadeTo(s,o);
        });
      };

      function createContainer(){
        var siteSettings = {
        'facebook': { text: 'Facebook', className: 'aFacebook', url: 'http://www.facebook.com/sharer.php?u={u}&amp;t={t}' },
        'google': { text: 'Google+', className: 'aGooglePlus', url: 'https://plus.google.com/share?url={u}' },
        'twitter': { text: 'Twitter', className: 'aTwitter', url: 'http://twitter.com/home?status={t}%20{u}' },
        };

        var sites = options.social.split(',');
        var listItem = '';
        for (var i = 0; i <= sites.length-1; i++) {
          siteSettings[ sites[i] ]['url'] = siteSettings[ sites[i] ]['url'].replace('{t}',encodeURIComponent(options.title)).replace('{u}',encodeURI(options.shareUrl)).replace('{d}',encodeURIComponent(options.description));
          listItem += '<li><a href="'+siteSettings[ sites[i] ]['url'] +'" target="_blank" rel="nofollow" class="'+siteSettings[ sites[i] ]['className'] +'"><span></span></a><span>'+siteSettings[ sites[i] ]['text'] +'</span></li>';
        };

        $('body').append(beforeDivs+listItem+afterDivs);
        addCustomContent();
      }

      function addCustomContent(){
        var previousContent = $(".arthrefSocialShare .centered").html();
        var content = "<h3 style='text-align:center; color:white'>Compartir es una mierda.<br/>Pero ayuda de cojones</h3> <p style='text-align:center; color:white;'>Si te gustó el post, difunde el mensaje. Gracias, tú molas"
        $(".arthrefSocialShare .centered").html(content + previousContent);
      }

      function destroyContainer(o) {
        if(o.blur) $('body').children().removeClass('blurred');
        $('.arthrefSocialShare').find('.overlay').removeClass('active');
        $('.arthrefSocialShare').find('ul').removeClass('active');
        setTimeout(function(){
          $('.arthrefSocialShare').find('.overlay').css('display','none');
          $('.arthrefSocialShare').remove();
        },300);
      }

    }

  });
})(jQuery);
