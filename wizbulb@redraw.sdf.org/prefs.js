'use strict';

const Gio = imports.gi.Gio;
const Gtk = imports.gi.Gtk;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();


function init() {}

function buildPrefsWidget() {
  // Copy the same GSettings code from `extension.js`
  this.settings = ExtensionUtils.getSettings(
    'org.gnome.shell.extensions.wizbulb'
  );

  // Create a parent widget that we'll return from this function
  let prefsWidget = new Gtk.Grid({
    column_spacing: 12,
    row_spacing: 12,
    visible: true
  });
  prefsWidget.set_margin_start(20)
  prefsWidget.set_margin_top(20)

  // Add a simple title and add it to the prefsWidget
  let title = new Gtk.Label({
    label: `<b>${Me.metadata.name} preferences</b>`,
    halign: Gtk.Align.START,
    use_markup: true,
    visible: true
  });
  prefsWidget.attach(title, 0, 0, 2, 1);

  let ipLabel = new Gtk.Label({
    label: 'IP:',
    halign: Gtk.Align.START,
    visible: true
  });
  prefsWidget.attach(ipLabel, 0, 1, 1, 1);

  let ip = new Gtk.Entry({
    buffer: new Gtk.EntryBuffer({
      text: this.settings.get_string('ip'),
    }),
    halign: Gtk.Align.END,
    visible: true
  });
  prefsWidget.attach(ip, 1, 1, 1, 1);

  this.settings.bind(
    'ip',
    ip.buffer,
    'text',
    Gio.SettingsBindFlags.DEFAULT
  );

  // Return our widget which will be added to the window
  return prefsWidget;
}
