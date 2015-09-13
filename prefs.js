/*
 * Show Ip menu gnome extension preferences
 * https://github.com/sgaraud/
 *
 */

const GLib = imports.gi.GLib;
const GObject = imports.gi.GObject;
const Gio = imports.gi.Gio;
const Gtk = imports.gi.Gtk;

const Gettext = imports.gettext.domain('gnome-shell-extensions');
const _ = Gettext.gettext;

function init() {

}

const IpPrefsWidget = new GObject.Class({
    Name: 'Ip.Prefs.Widget',
    GTypeName: 'IpPrefsWidget',
    Extends: Gtk.Grid,

    _init: function(params) {
        this.parent(params);
        //this.margin = 12;
        //this.row_spacing = this.column_spacing = 6;
        this.set_orientation(Gtk.Orientation.VERTICAL);

        this.add(new Gtk.Label({ label: "Message", wrap: true, xalign: 0}));
        this.add(new Gtk.Entry({ hexpand: true}));

        let primaryText = _("Sow Ip preferences.");
        this.add(new Gtk.Label({ label: primaryText, wrap: true, xalign: 0 }));

        this.add(new Gtk.CheckButton({ label: _("test check button")}));
        this.add(new Gtk.RadioButton({ label: _("test radio button")}));
    }
});

function buildPrefsWidget() {
    let widget = new IpPrefsWidget();
    widget.show_all();

    return widget;
}