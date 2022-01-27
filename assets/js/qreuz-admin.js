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

});
