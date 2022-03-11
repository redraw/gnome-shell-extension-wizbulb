/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

/* exported init */

const GETTEXT_DOMAIN = 'wizbulb';

const {Gio, GObject, St} = imports.gi;

const Gettext = imports.gettext.domain(GETTEXT_DOMAIN);
const _ = Gettext.gettext;

const Main = imports.ui.main;
const Util = imports.misc.util;
const Me = imports.misc.extensionUtils.getCurrentExtension();
const ExtensionUtils = imports.misc.extensionUtils;

const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;

const Indicator = GObject.registerClass(
  class Indicator extends PanelMenu.Button {
    _init() {
      super._init(0.0, _('WiZ Bulb'));

      const settings = ExtensionUtils.getSettings(
        "org.gnome.shell.extensions.wizbulb"
      )

      const cmd = [
        "bash",
        `${Me.dir.get_path()}/control.sh`,
        settings.get_string("ip"),
      ]

      this.add_child(new St.Icon({
        gicon: Gio.icon_new_for_string(Me.dir.get_path() + '/icon.svg'),
        style_class: 'system-status-icon',
      }));

      let item1 = new PopupMenu.PopupMenuItem(_('Turn on'));
      item1.connect('activate', () => {
        Util.spawn([...cmd, "on"])
        Main.notify(_('Light on!'))
      });
      this.menu.addMenuItem(item1);

      let item2 = new PopupMenu.PopupMenuItem(_('Turn off'));
      item2.connect('activate', () => {
        Util.spawn([...cmd, "off"])
        Main.notify(_('Light off!'))
      });
      this.menu.addMenuItem(item2);

      let item3 = new PopupMenu.PopupMenuItem(_('Lighter'));
      item3.connect('activate', () => {
        Util.spawn([...cmd, "lighter"])
        Main.notify(_('Brightness++'))
      });
      this.menu.addMenuItem(item3);

      let item4 = new PopupMenu.PopupMenuItem(_('Darker'));
      item4.connect('activate', () => {
        Util.spawn([...cmd, "darker"])
        Main.notify(_('Brightness--'))
      });
      this.menu.addMenuItem(item4);

      let item5 = new PopupMenu.PopupMenuItem(_('Warmer'));
      item5.connect('activate', () => {
        Util.spawn([...cmd, "warmer"])
        Main.notify(_('Temp++'))
      });
      this.menu.addMenuItem(item5);

      let item6 = new PopupMenu.PopupMenuItem(_('Colder'));
      item6.connect('activate', () => {
        Util.spawn([...cmd, "colder"])
        Main.notify(_('Temp--'))
      });
      this.menu.addMenuItem(item6);
    }
  }
);

class Extension {
  constructor(uuid) {
    this._uuid = uuid;

    ExtensionUtils.initTranslations(GETTEXT_DOMAIN);
  }

  enable() {
    this._indicator = new Indicator();
    Main.panel.addToStatusArea(this._uuid, this._indicator);
  }

  disable() {
    this._indicator.destroy();
    this._indicator = null;
  }
}

function init(meta) {
  return new Extension(meta.uuid);
}
