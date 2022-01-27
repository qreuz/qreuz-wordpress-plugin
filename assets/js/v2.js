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
<img src="https://ping.qreuz.com/?v=2" id="qreuz-v2" />
<script>
var qreuzQueryString = location.search;
while( qreuzQueryString.charAt(0) === "?" ) {
	qreuzQueryString.substr(1);
}
document.getElementById('qreuz-v2').src += '&qtref=' + encodeURIComponent(document.referrer) + qreuzQueryString;
</script>
