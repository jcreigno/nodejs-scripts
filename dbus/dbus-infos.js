var dbus = require('node-dbus');


//dbus-send --print-reply --session --dest="org.freedesktop.Notifications" /org/freedesktop/Notifications org.freedesktop.DBus.Introspectable.Introspect

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

var dbusMsg = Object.create(dbus.DBusMessage, {
  destination: {
    value: dbus.DBUS_SERVICE_DBUS
  },
  path: {
    value: dbus.DBUS_PATH_DBUS
  },
  iface: {
    value: dbus.DBUS_INTERFACE_DBUS
  },
  member: {
    value: 'ListNames',
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


//dbusMsg.appendArgs('s','org.freedesktop.Notifications');
//send signal on session bus
//check signal receipt in 'test-signal-listener' process
//or on your terminal with $dbus-monitor --session
dbusMsg.send();
