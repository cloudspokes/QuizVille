$(function() {
  var channel = $('#channel').text();
  var username = $('#username').text();

  var cometd = new Faye.Client('http://qq-server.herokuapp.com//cometd', {timeout: 120});
  cometd.disable('websocket');
  
  if(channel) {
    var subscription = cometd.subscribe(channel, function(message) {
      console.log(message);
      m = message.sobject;
      
      $('<div class="answer" id="'+ m.Id +'"><span class="user">'+ username +'</span><span class="language '+ m.Type__c +'">'+ m.Type__c +'</span><span class="correct '+ m.Is_Correct__c +'">'+ m.Is_Correct__c  +'</span><span class="time">'+ m.Elapsed_Time_Seconds__c  +'</span></div>')
        .appendTo('#answers');
    });
    subscription.callback(function() {
      console.log('Subscription is now active!');
    });
    subscription.errback(function(error) {
      console.log(error.message);
    });
  }
  
  var demo_publish = function() {
    console.log('demo_publish');
    var languages = ["Ruby", "Javascript", "Python", "C++", "Scala"];
    var language = languages[Math.floor(Math.random() * languages.length)];
    var time = Math.floor(Math.random() * 11) + '.' + Math.floor(Math.random() * 11);
    var correct = Array('true', 'false')[Math.floor(Math.random() * 2)];
    cometd.publish("/q/demo", 
      {"sobject": {
        "Id":"~~id~~",
        "Type__c": language,
        "Is_Correct__c": correct,
        "Elapsed_Time_Seconds__c": time}
      }
    );
  };
  
  if(channel == '/q/demo') {
    setInterval (demo_publish, 3000);
  }
});
