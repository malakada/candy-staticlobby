/** File: staticlobby.js
 * Candy Plugin Static Lobby Tab
 * Author: Melissa Adamaitis <melissa@melissanoelle.com>
 */

var CandyShop = (function(self) { return self; }(CandyShop || {}));

CandyShop.StaticLobby = (function(self, Candy, $) {
  /** Object: about
   *
   * Contains:
   *  (String) name - Candy Plugin Static Lobby Tab
   *  (Float) version - Candy Plugin Static Lobby Tab
   */
  self.about = {
    name: 'Candy Plugin Static Lobby Tab',
    version: '0.1'
  };


  /**
   * Initializes the Static Lobby plugin with the default settings.
   */
  self.init = function(){
    // Initialize a new ChatRoster instance for the static lobby's global chatroom.
    this.globalRoster = new Candy.Core.ChatRoster();

    // Once we have a CONNECTED status from Strophe, ask for the global roster.
    $(Candy).on('candy:view.connection.status-5', function(){
      self.addLobbyHtml();
      self.getGlobalRoster();
      return true;
    });
  };

  self.addLobbyHtml = function(){
    if(Candy.View.Pane.Chat.getTab('lobby').length == 0) {
      var roomJid = 'lobby@powerhrg.com',
        tab_html = '<li class="roomtype-static" data-roomjid="lobby" data-roomtype="static"><a href="#" class="label">Lobby</a></li>',
        tab = $(tab_html).prependTo('#chat-tabs'), // Can't use default Candy.View.Pane.Chat.addTab() because we want to prepend, not append.
        pane_html = '<div class="room-pane roomtype-static" id="chat-room-lobby" data-roomjid="lobby" data-roomtype="static">' +
          '<div class="roster-pane"></div><div class="message-pane-wrapper"><ul class="message-pane"><li>Static lobby.</li></ul></div></div>',
        pane = $(pane_html).prependTo('#chat-rooms');

      tab.click(function(){
        $('#chat-rooms > div').hide();
        $('#chat-tabs > li').removeClass('active');
        $('#chat-room-lobby').show();
        $('#chat-tabs > li[data-roomjid="lobby"]').addClass('active');
        $('#chat-room-lobby .roster-pane > div').show();
      });
      // Candy.View.Pane.Chat.fitTabs();
    }
  }

  self.getGlobalRoster = function(){
    console.log('in getGlobalRoster');
    Candy.Core.getConnection().roster.get(function(iq){
      for (var i = 0; i < iq.length; i++) {
        try {
          var name = iq[i].name || iq[i].jid;
          var user = new Candy.Core.ChatUser(iq[i].jid, name, 'member', 'participant');
        } catch(e) {
          console.log('Error creating candy core chatuser: ' + e.message);
        }
        self.globalRoster.add(user);
        self.addUser(user);
      }
      return true;
    });
  }
  /*
   * Display the user in a roster-like setting in the lobby.
   */
  self.addUser = function(chatuser){
    var user_affiliation = chatuser.getAffiliation();
    var user_nick = chatuser.getNick();
    var user_role = chatuser.getRole();
    var user_html = '<div class="user role-' + user_role + ' affiliation-' + user_affiliation + '"' +
        ' id="user-lobby-' + chatuser.id + '" data-jid="' + chatuser.getJid() + '"' +
        ' data-nick="' + user_nick + '" data-role="' + user_role + '" data-affiliation="' + user_affiliation + '">' +
        '<div class="label">' + user_nick + '</div><ul>' +
        '<li class="context" id="context-lobby-' + chatuser.id + '">&#x25BE;</li>' +
        '<li class="role role-' + user_role + ' affiliation-' + user_affiliation + '" data-tooltip="{{tooltipRole}}"></li>' +
        '<li class="ignore" data-tooltip="{{tooltipIgnored}}"></li></ul></div>';
    $('#chat-room-lobby .roster-pane').append(user_html);
  }
  return self;
}(CandyShop.StaticLobby || {}, Candy, jQuery));


Candy.View.Pane.Chat.addTab('Lobby','Lobby',null);

