var dbus = require('node-dbus');

// introspect dbus service org.freedesktop.Notifications
//dbus-send --print-reply --session --dest="org.freedesktop.Notifications" /org/freedesktop/Notifications org.freedesktop.DBus.Introspectable.Introspect
//dbus-send --print-reply --session --dest="org.freedesktop.Notifications" /org/freedesktop/Notifications org.freedesktop.Notifications.GetServerInformation
//method call sender=:1.419 -> dest=:1.40 serial=7 path=/org/freedesktop/Notifications; interface=org.freedesktop.Notifications; member=Notify
//   string "notify-send"
//   uint32 0
//   string ""
//   string "hello"
//   string "alkezfnalkzfn"
//   array [
//   ]
//   array [
//      dict entry(
//         string "urgency"
//        variant             byte 1
//      )
//  ]
//   int32 -1



// http://www.galago-project.org/specs/notification/0.9/x408.html


var dbusMsg = Object.create(dbus.DBusMessage, {
  destination: {
    value: 'org.freedesktop.Notifications'
  },
  path: {
    value: '/org/freedesktop/Notifications'
  },
  iface: {
    value: 'org.freedesktop.Notifications'
  },
  member: {
    value: 'Notify',
    writable: true
  },
  bus: {
    value: dbus.DBUS_BUS_SESSION
  },
  type: {
    value: dbus.DBUS_MESSAGE_TYPE_METHOD_CALL,
    writable: true
  }
});

dbusMsg.on ("methodResponse", function (arg) {
  console.log ("[PASSED] Got method response with data ::");
  console.log (arguments);
});

dbusMsg.on ("error", function (error) {
  console.log ("[FAILED] ERROR -- ");
  console.log(error);
});


//dbusMsg.appendArgs('s','node');
//dbusMsg.appendArgs('i',0);
//dbusMsg.appendArgs('s','');
//dbusMsg.appendArgs('s','Hello');
//dbusMsg.appendArgs('s','from node dbus');
//dbusMsg.appendArgs('a',[]);
dbusMsg.appendArgs('susssasa{sv}i', 'node',0,'/usr/share/icons/gnome/48x48/status/software-update-urgent.png','Hello','from node dbus',[''],{'urgency':1},-1);
//send signal on session bus
//check signal receipt in 'test-signal-listener' process
//or on your terminal with $dbus-monitor --session
dbusMsg.send();
