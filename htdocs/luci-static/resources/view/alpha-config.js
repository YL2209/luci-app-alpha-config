/* This is free software, licensed under the Apache License, Version 2.0
 *
 * Copyright (C) 2024 Hilman Maulana <hilman0.0maulana@gmail.com>
 */

'use strict';
'require view';
'require form';
'require fs';
'require ui';

var trans_set = [0.1, 0.2, 0.3, 0.4,
	0.5, 0.6, 0.7, 0.8, 0.9, 1 ];
return view.extend({
	render: function () {
		var m, s, o;
		m = new form.Map('alpha', _('Alpha theme configuration'), _('Here you can set background login and dashboard themes. Chrome is recommended.'));
		s = m.section(form.TypedSection, 'theme', _('Theme configuration'));
		s.anonymous = true;
		o = s.option(form.Value, 'color', _('Primary color'), _('A HEX color (default: #2222359a).'));
		o.rmempty = false;
		o.validate = function(section_id, value) {
			if (section_id)
				return /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{8}|[0-9a-fA-F]{3}|[0-9a-fA-F]{4})$/i.test(value) || _('Expecting: valid HEX color value');
			return true;
		};
		o = s.option(form.Value, 'blur', _('Frosted glass effect'), _('Fill in an integer here.'));
		o.rmempty = false;
		o = s.option(form.ListValue, 'opacity', _('Transparency level'),
			_('0 transparent - 1 opaque (suggest: transparent: 0 or translucent preset: 0.5).'));
		for (var i of trans_set)
			o.value(i);
		o.default = '1';
		o.rmempty = false;
		o = s.option(form.Flag, 'navbar', _('Navigation bar'), _('Enable navigation bar menu.'));
		o.rmempty = false;
		var bg_path = '/www/luci-static/alpha/background/';
		s = m.section(form.TypedSection, 'theme' , _('Background configuration'), _('You can upload files such as jpg or png files, and files will be uploaded to <code>%s</code>.').format(bg_path));
		s.anonymous = true;
		o = s.option(form.Button, 'login', _('Login'), _('Upload file for login background.'));
		o.inputstyle = 'action';
		o.inputtitle = _('Upload');
		o.onclick = function(ev) {
			var file = bg_path + 'login.png';
			return ui.uploadFile(file, ev.target).then(function() {
				return fs.exec('chmod', ['777', file]).then(function() {
					ui.addNotification(null, E('p', _('Login picture successfully uploaded.')));
				});
			}).catch(function(e) { ui.addNotification(null, E('p', e.message)); });
		};
		o.modalonly = true;
		o = s.option(form.Button, 'dashboard', _('Dashboard'), _('Upload file for dashboard background.'));
		o.inputstyle = 'action';
		o.inputtitle = _('Upload');
		o.onclick = function(ev) {
			var file = bg_path + 'dashboard.png';
			return ui.uploadFile(file, ev.target).then(function() {
				return fs.exec('chmod', ['777', file]).then(function() {
					ui.addNotification(null, E('p', _('Dashboard picture successfully uploaded.')));
				});
			}).catch(function(e) { ui.addNotification(null, E('p', e.message)); });
		};
		o.modalonly = true;

		s = m.section(form.GridSection, 'navbar', _('Navigation bar configuration'));
		s.anonymous = true;
		s.addremove = true;
		s.rowcolors = true;
		s.modaltitle = _('Add new navigation')
		s.addbtntitle = _('Add new navigation...');
		o = s.option(form.DummyValue, 'name', _('Name'));
		o.modalonly = false;
		o = s.option(form.DummyValue, 'enable', _('Status'));
		o.modalonly = false;
		o = s.option(form.DummyValue, 'line', _('Line'));
		o.modalonly = false;
		o = s.option(form.DummyValue, 'newtab', _('New tab'));
		o.modalonly = false;
		o = s.option(form.DummyValue, 'icon', _('Icon'));
		o.modalonly = false;
		o = s.option(form.DummyValue, 'address', _('Address'));
		o.modalonly = false;

		o = s.option(form.Value, 'name', _('Name navigation bar'));
		o.rmempty = false;
		o.modalonly = true;
		o = s.option(form.Flag, 'enable', _('Navigation bar'), _('Enable navigation bar.'));
		o.rmempty = false;
		o.modalonly = true;
		o.enabled = _('Enable');
		o.disabled = _('Disable');
		o.default = o.enabled;
		o = s.option(form.Value, 'line', _('Line number'), _('Enter a line number between 1 to 10.'));
		o.rmempty = false;
		o.modalonly = true;
		o.datatype = 'range(1,10)';
		o.placeholder = '1-10';
		o = s.option(form.Flag, 'newtab', _('Open in new tab'), _('Enable open links in a new tab.'));
		o.rmempty = false;
		o.modalonly = true;
		o.enabled = _('Yes');
		o.disabled = _('No');
		o = s.option(form.FileUpload, 'icon', _('Icon'), _('Upload PNG file with size 256x256.'));
		o.rmempty = false;
		o.modalonly = true;
		o.datatype = 'png';
		o.root_directory = '/www/luci-static/alpha/gaya/icon/navbar';
		o.onchange = function(ev, section_id, value) {
			fs.exec('chmod', ['777', value]);
			return true;
		};
		o = s.option(form.Value, 'address', _('Address'));
		o.value('/cgi-bin/luci/admin/network/wireless', _('WiFi'));
		o.value('/cgi-bin/luci/admin/dashboard', _('Neko'));
		o.value('/cgi-bin/luci/admin/network/network', _('Network'));
		o.value('/cgi-bin/luci/admin/status/overview', _('Overview'));
		o.value('/cgi-bin/luci/admin/system/ttyd', _('Terminal'));
		o.rmempty = false;
		o.modalonly = true;

		return m.render();
	},
});
