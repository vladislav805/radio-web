<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=yes" />
		<title>Online Radio v7.2</title>
		<script src="lib/__api.js"></script>
		<script src="lib/main.js"></script>
		<script src="hls.js"></script>
		<link rel="stylesheet" href="main.css" />
		<link rel="icon" href="favicon.png" />
	</head>
<!--
	 ____________
	|            |
	|    v7.x    |
	| 16/04/2017 |
	|____________|

	v7.0.0 / build 20170414
	Переписан с нуля API, переписан с нуля плеер

		v7.0.1 / build 20170416
		Добавлены базовые настройки

		v7.0.2 / build 20170419
		Добавлен счетчик примерного трафика

		v7.0.3 / build 20170712
		Минифицированы стили и скрипты, изменен цвет

		v7.0.4 / build 20170716
		Исправлено пару багов, добавлен favicon, полностью пересобраны данные

		v7.0.5 / build 20170716
		Добавлено контекстное меню к радиостанциям

		v7.0.6 / build 20171010
		При нажатии на иконку трека или его пикчу запрашивается трек

	v7.1 / build 20171101
	Поддержка радиостанций с HLS

		v7.1.1 / build 20180111
		Исправлено зацикливание onError при инициализации пустым плеером

		v7.1.2 / build 20180417
		Исправлено воспроизведение переключение радиостанций после прослушки HLS, а также обновление битрейта у стримов HLS

	v7.2 / build 20190628
	Добавление ночной темы (пока что пермиссивно)

		v7.2.1 / build 20190630
		Исправлено повторное открытие контекстного меню на станциях

-->
	<body>
		<div class="wrap">
			<div class="header">
				<div class="controls-left">
					<div id="p-control" class="icon icon-play-0"></div>
					<div id="p-mute" class="icon icon-mute-0"></div>
				</div>
				<div class="controls-right">
					<div id="p-meta" class="p-loading">
						<div class="p-meta-col">
							<div id="p-time">00:00</div>
							<div id="p-amount">0.0MB</div>
						</div>
					</div>
					<div id="p-settings-button" class="icon icon-settings"></div>
				</div>
			</div>
			<div class="content" id="content">
				<div class="settings" id="p-settings">
					<label class="settings-item">
						<div class="settings-label">Try to establish connection after error</div>
						<div class="settings-value"><input type="checkbox" name="on-error-continue" onchange="Settings.onChange(this);" /></div>
					</label>
					<label class="settings-item">
						<div class="settings-label">Auto recognize track during broadcast</div>
						<div class="settings-value"><input type="checkbox" name="auto-resolve-track" onchange="Settings.onChange(this);" /></div>
					</label>
					<label class="settings-item">
						<div class="settings-label">Preferred quality</div>
						<div class="settings-value">
							<select name="preferred-quality" onchange="Settings.onChange(this);">
								<option value="320">320 kbps</option>
								<option value="256">256 kbps</option>
								<option value="192">192 kbps</option>
								<option value="128">128 kbps</option>
								<option value="96">96 kbps</option>
								<option value="64">64 kbps</option>
								<option value="32">32 kbps</option>
							</select>
						</div>
					</label>
					<div class="version">app v7.2.1; data v20170716-f</div>
				</div>
				<div class="list" id="list"></div>
			</div>
			<div class="player">
				<img class="player-cover" id="p-image" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3C/svg%3E" alt="" />
				<div class="player-info">
					<div class="player-title" id="p-title">Waiting...</div>
					<div class="player-artist" id="p-artist">Select station</div>
				</div>
				<div class="bitrate" id="p-bitrate">
					<div id="p-bitrate-value">&mdash;</div>
					<div id="p-bitrate-list"></div>
				</div>
			</div>
		</div>
		<div class="footer">Vladislav Veluga &copy; 2013-2020 | <a href="https://docs.google.com/document/d/13vGM4hKHbo9JajzweqLxUHUxXxhtTIS0cUNNX2Y0vnU/view">API</a></div>
		<!-- Yandex.Metrika counter -->
		<script type="text/javascript">
			(function (d, w, c) {
				(w[c] = w[c] || []).push(function() {
					try {
						w.yaCounter16828789 = new Ya.Metrika({id:16828789});
					} catch(e) { }
				});
				var n = d.getElementsByTagName("script")[0],
					s = d.createElement("script"),
					f = function () {
						n.parentNode.insertBefore(s, n);
					};
				s.type = "text/javascript";
				s.async = true;
				s.src = (d.location.protocol === "https:" ? "https:" : "http:") + "//mc.yandex.ru/metrika/watch.js";
				if (w.opera === "[object Opera]")
					d.addEventListener("DOMContentLoaded", f, false);
				else
					f();
				if (top.location.href !== window.location.href)
					top.location.href = window.location.href;
			})(document, window, "yandex_metrika_callbacks");
		</script>
		<noscript>
			<img src="//mc.yandex.ru/watch/16828789" style="position:absolute; left:-9999px;" alt="" />
		</noscript>
		<!-- /Yandex.Metrika counter -->
	</body>
</html>