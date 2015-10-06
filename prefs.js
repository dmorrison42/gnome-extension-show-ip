/*
 * Show Ip menu gnome extension preferences
 * https://github.com/sgaraud/
 *
 */

const GLib = imports.gi.GLib;
const GObject = imports.gi.GObject;
const Gio = imports.gi.Gio;
const Gtk = imports.gi.Gtk;
const Lang = imports.lang;

const Gettext = imports.gettext.domain('gnome-shell-extensions');
const _ = Gettext.gettext;

const IP_SETTINGS_SCHEMA = 'org.gnome.shell.extensions.show-ip';
const IP_DESTINATION = 'ip-destination';
const PUBLIC_IP = 'public-ip';

const N_ = function(e) { return e };
const METHODS = {
    'wget': N_("use wget"),
    'curl': N_("use curl"),
};

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience;

function init() {

}

const IpPrefsWidget = new GObject.Class({
    Name: 'Ip.Prefs.Widget',
    GTypeName: 'IpPrefsWidget',
    Extends: Gtk.Grid,

    _init: function(params) {
        this.parent(params);
        this._loadConfig();
        this.margin = 20;
        this.row_spacing = this.column_spacing = 10;
        this.set_orientation(Gtk.Orientation.VERTICAL);

        let primaryText = new Gtk.Label({
            label: _("Show public IP")
        });
        this.add(primaryText);

        let showPublic = new Gtk.Switch({
            halign: Gtk.Align.CENTER
        });
        this.add(showPublic);

        showPublic.set_active(this._settings.get_boolean('public-ip'));
        showPublic.connect('notify::active', Lang.bind(this, function(check){
            this.settings.set_boolean('public-ip', check.get_active());
        }));

        let slabel = new Gtk.Label({
            label: _("Public IP service or URL")
        });
        this._sentry = new Gtk.Entry({
            text: this._ipDestination,
            halign: Gtk.Align.CENTER
        });
        this._sentry.connect("activate", Lang.bind(this, function() {
            this._ipDestination = this._sentry.text;
        }));

        this.add(slabel);
        this.add(this._sentry);

        let curlMethod = new Gtk.RadioButton({label: _("use curl method")});
        curlMethod.set_active(!this._settings.get_boolean('wget-method'));
        curlMethod.connect('toggled', Lang.bind(this, function(check){
            if(check.get_active()) this._settings.set_boolean('wget-method', false);
        }));
        let wgetMethod = new Gtk.RadioButton({label: _("use wget method"), group: curlMethod});
        wgetMethod.set_active(this._settings.get_boolean('wget-method'));
        wgetMethod.connect('toggled', Lang.bind(this, function(check){
            if(check.get_active()) this._settings.set_boolean('wget-method', true);
        }));

        this.add(curlMethod);
        this.add(wgetMethod);

    },

    _loadConfig: function() {
        this._settings = Convenience.getSettings(IP_SETTINGS_SCHEMA);
    },

    get _ipDestination() {
        if (!this._settings)
            this._loadConfig();
        return this._settings.get_string(IP_DESTINATION);
    },

    set _ipDestination(v) {
        if (!this._settings)
            this._loadConfig();
        this._settings.set_string(IP_DESTINATION, v);
    },

    get _publicIp() {
        if (!this._settings)
            this._loadConfig();
        return this._settings.get_boolean(PUBLIC_IP);
    },

    set _publicIp(v) {
        if (!this._settings)
            this._loadConfig();
        this._settings.set_boolean(PUBLIC_IP, v);
    },

});

function buildPrefsWidget() {
    let widget = new IpPrefsWidget();
    widget.show_all();
    return widget;
}