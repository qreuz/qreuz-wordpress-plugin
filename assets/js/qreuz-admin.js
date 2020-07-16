/** Qreuz plugin for WordPress.

Copyright (C) 2020 by Qreuz GmbH <https://qreuz.com/legal-notice>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.
**/
jQuery(document).ready(function($){

	/*
     * AJAX handler for: Qreuz Smart Pricing Synchronize
     */
    $('.qreuz-wrapper #qreuz_smart_pricing_synchronize input[type="submit"]').click(function(e){
        e.preventDefault();
        $(this).attr('value','Updating...').removeClass('qr-btn-red').addClass('button-primary');
        var data = {
			'action': 'qreuz_do_synchronize_prices',
			'_wpnonce' : $('.qreuz-wrapper #qreuz_smart_pricing_synchronize input[name=_wpnonce]').val(),
            'qreuz_current_time' : $.now()
        };
        $.post(ajaxurl, data, function(response) {
            if(response == 'qreuz-price-update-successful'){
                $('.qreuz-wrapper #qreuz_smart_pricing_synchronize input[type="submit"]').attr('value','Done').removeClass('qreuz_synchronize');
            } else {
                $('.qreuz-wrapper #qreuz_smart_pricing_synchronize input[type="submit"]').attr('value','ERROR').removeClass('button-primary qreuz_synchronize').addClass('qr-btn-red');
            }
        });
	});

	/*
     * AJAX handler for: Qreuz Authentification Step: Email
     */
    $('.qreuz-wrapper #qreuz_authentification_email input[type="submit"]').click(function(e){
        e.preventDefault();
        $(this).attr('value','Authentification started...').removeClass('qr-btn-red').addClass('button-primary');
        var data = {
            'action': 'qreuz_do_authentification_start',
			'qreuz_current_time' : $.now(),
			'qreuz_userdata_email' : $('.qreuz-wrapper #qreuz_authentification_email input[name=qreuz_userdata_email]').val(),
			'_wpnonce' : $('.qreuz-wrapper #qreuz_authentification_email input[name=_wpnonce]').val(),
			'_wp_http_referer' : $('.qreuz-wrapper #qreuz_authentification_email input[name=_wp_http_referer]').val(),
			'form' : $('.qreuz-wrapper #qreuz_authentification_email input[name=form]').val(),
		};
        $.post(ajaxurl, data, function(response) {
            if(response == 'qreuz-authentification-started'){
				$('.qreuz-wrapper #qreuz_authentification_email input[type="submit"]').attr('value','Success.');
				$('.qreuz-wrapper #qreuz_authentification_email #success').removeClass('hidden').text('\u2714 email sent. Check your inbox now.');
				$('.qreuz-wrapper #qreuz_authentification_email input[name=qreuz_userdata_email]').prop('disabled', true);
				$('.qreuz-wrapper #qreuz_authentification_email input[type="submit"]').prop('disabled', true);
				$('.qreuz-wrapper #qreuz_authentification_toqen input[type="submit"]').prop('disabled', false);
				$('.qreuz-wrapper #qreuz_authentification_toqen input[type="text"]').prop('disabled', false);
				$('.qreuz-wrapper #qreuz_authentification_toqen').removeClass('disabled');
			} else {
                $('.qreuz-wrapper #qreuz_authentification_email input[type="submit"]').attr('value','Error.').removeClass('button-primary').addClass('qr-btn-red');
            }
        });
	});

	/*
     * AJAX handler for: Qreuz Authentification Step: Toqen
     */
    $('.qreuz-wrapper #qreuz_authentification_toqen input[type="submit"]').click(function(e){
        e.preventDefault();
        $(this).attr('value','Trying to connect...').removeClass('qr-btn-red').addClass('button-primary');
        var data = {
            'action': 'qreuz_do_authentification_toqen',
			'qreuz_current_time' : $.now(),
			'qreuz_userdata_toqen' : $('.qreuz-wrapper #qreuz_authentification_toqen input[name=qreuz_userdata_toqen]').val(),
			'_wpnonce' : $('.qreuz-wrapper #qreuz_authentification_toqen input[name=_wpnonce]').val(),
			'_wp_http_referer' : $('.qreuz-wrapper #qreuz_authentification_toqen input[name=_wp_http_referer]').val(),
			'form' : $('.qreuz-wrapper #qreuz_authentification_toqen input[name=form]').val(),
		};
        $.post(ajaxurl, data, function(resp_json) {
			var response = jQuery.parseJSON(resp_json);
            if(response.success == 'true'){
				$('.qreuz-wrapper #qreuz_authentification_toqen input[type="submit"]').prop('disabled', true).attr('value','Success.');
				$('.qreuz-wrapper #qreuz_authentification_toqen input[name=qreuz_userdata_toqen]').prop('disabled', true);
				$('.qreuz-wrapper #qreuz_authentification_toqen #success').removeClass('hidden').text('\u2714 Connected');
			} else {
				$('.qreuz-wrapper #qreuz_authentification_toqen input[type="submit"]').attr('value','Error.').removeClass('button-primary').addClass('qr-btn-red');
			}
        });
	});

	/** AJAX handler for: Logged in info visible */
	if ( $('.qreuz-wrapper #qreuz_logged_in_info').length > 0 ) {
		$('.qreuz-wrapper #qreuz_logged_in_info').prepend('\u2714 Connection to Qreuz active.').append('<br /><a id="qreuz_logout" class="qreuz_logout">Disconnect</a>');
		$('.qreuz-wrapper #qreuz_authentification_email input[name=qreuz_userdata_email]').prop('disabled', true);
		$('.qreuz-wrapper #qreuz_authentification_email input[type="submit"]').prop('disabled', true);
		$('.qreuz-wrapper #qreuz_authentification_toqen input[type="submit"]').prop('disabled', true);
		$('.qreuz-wrapper #qreuz_authentification_toqen input[name=qreuz_userdata_toqen]').prop('disabled', true);
		$('.qreuz-wrapper #qreuz_login_preinfo').addClass('hidden');
	}
	$('.qreuz-wrapper #qreuz_change_creds').click(function(e){
		e.preventDefault();
		$('.qreuz-wrapper #qreuz_logged_in_info').text('').addClass('hidden');
		$('.qreuz-wrapper #qreuz_authentification_email input[name=qreuz_userdata_email]').prop('disabled', false);
		$('.qreuz-wrapper #qreuz_authentification_email input[type="submit"]').prop('disabled', false);
		$('.qreuz-wrapper #qreuz_authentification_toqen input[type="submit"]').prop('disabled', false);
		$('.qreuz-wrapper #qreuz_authentification_toqen input[name=qreuz_userdata_toqen]').prop('disabled', false);
		$('.qreuz-wrapper #qreuz_login_preinfo').removeClass('hidden');
	});
	$('.qreuz-wrapper #qreuz_logout').click(function(e){
		e.preventDefault();
		$('.qreuz-wrapper #qreuz_logged_in_info').text('Logging you out...');
		var data = {
            'action': 'qreuz_do_logout',
			'qreuz_current_time' : $.now(),
			'_wpnonce' : $('.qreuz-wrapper #qreuz_authentification_toqen input[name=_wpnonce]').val(),
			'_wp_http_referer' : $('.qreuz-wrapper #qreuz_authentification_toqen input[name=_wp_http_referer]').val(),
		};
		$.post(ajaxurl, data, function(response) {
			if(response == 'logged-out'){
				$('.qreuz-wrapper #qreuz_logged_in_info').text('').addClass('hidden');
				$('.qreuz-wrapper #qreuz_authentification_email input[name=qreuz_userdata_email]').prop('disabled', false).val('');
				$('.qreuz-wrapper #qreuz_authentification_email input[type="submit"]').prop('disabled', false);
				$('.qreuz-wrapper #qreuz_authentification_toqen input[type="submit"]').prop('disabled', true);
				$('.qreuz-wrapper #qreuz_authentification_toqen input[name=qreuz_userdata_toqen]').prop('disabled', true).val('');
				$('.qreuz-wrapper #qreuz_login_preinfo').removeClass('hidden');
			}
		});
	});

	/** AJAX handler for: Login required */
	if ( $('.qreuz-wrapper #qreuz_logged_in_required').length > 0 ) {
		$('.qreuz-wrapper #qreuz_logged_in_required').prepend('\u26A0 You must authenticate with your Qreuz account to access this feature. <br />').append('<br />');
		$('.qreuz-wrapper .qreuz_smart_tracking_form input').prop('disabled', true);
		$('.qreuz-wrapper .qreuz_smart_tracking_form').addClass('disabled');
		$('.qreuz-wrapper #qreuz_smart_tracking').addClass('disabled');
	}

	/*
     * AJAX handler for: Qreuz Smart Tracking Integration Settings
     */
    $('.qreuz-wrapper #qreuz_smart_tracking_integrations input[type="submit"]').click(function(e){
		e.preventDefault();
		$('.qreuz-wrapper #qreuz_smart_tracking_integrations input[type="submit"]').attr('value','Saving...');
        var data = {
            'action': 'qreuz_do_update_integration_settings',
			'qreuz_current_time' : $.now(),
			'qreuz_ti_ga_property_id' : $('.qreuz-wrapper #qreuz_smart_tracking_integrations input[name=qreuz_ti_ga_property_id]').val(),
			'qreuz_ti_fb_pixel_id' : $('.qreuz-wrapper #qreuz_smart_tracking_integrations input[name=qreuz_ti_fb_pixel_id]').val(),
			'qreuz_ti_bing_uet_id' : $('.qreuz-wrapper #qreuz_smart_tracking_integrations input[name=qreuz_ti_bing_uet_id]').val(),
			'qreuz_ti_gmerch_id' : $('.qreuz-wrapper #qreuz_smart_tracking_integrations input[name=qreuz_ti_gmerch_id]').val(),
			'_wpnonce' : $('.qreuz-wrapper #qreuz_smart_tracking_integrations input[name=_wpnonce]').val(),
			'_wp_http_referer' : $('.qreuz-wrapper #qreuz_smart_tracking_integrations input[name=_wp_http_referer]').val(),
			'form' : $('.qreuz-wrapper #qreuz_smart_tracking_integrations input[name=form]').val(),
		};
        $.post(ajaxurl, data, function(response) {
            if(response == 'userdata-updated'){
				$('.qreuz-wrapper #qreuz_smart_tracking_integrations input[type="submit"]').attr('value','Saved.');
				$('.qreuz-wrapper #qreuz_smart_tracking_integrations #success').removeClass('hidden').text('\u2714 Settings updated.');

			} else {
                $('.qreuz-wrapper #qreuz_smart_tracking_integrations input[type="submit"]').attr('value','Error.').removeClass('button-primary').addClass('qr-btn-red');
            }
        });
	});

	/**
	 * disable login fields if necessary
	 */
	$(function() {
		if($('.qreuz-wrapper #qreuz_authentification_toqen').hasClass('disabled')) {
			$('.qreuz-wrapper #qreuz_authentification_toqen input[type="submit"]').prop('disabled', true);
			$('.qreuz-wrapper #qreuz_authentification_toqen input[type="text"]').prop('disabled', true);
		}
	});		

	/**
	 * Tooltip function
	 */
	$(function() {
		$(".qreuz").tooltip({
			items: 'span[class=qreuz_admin_helptip]',
			classes: {
				"ui-tooltip": "qreuz_helptip_element"
			},
			tooltipClass: "qreuz_helptip_element_depr",
			position: {
				my: "left+25 bottom-5"
			}
		});
	});

});
