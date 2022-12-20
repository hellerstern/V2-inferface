/* eslint-disable */
import * as React from 'react';
import './src/index.css';
import {
	widget,
	ChartingLibraryWidgetOptions,
	LanguageCode,
	IChartingLibraryWidget,
	ResolutionString,
	TimeFrameType,
	VisiblePriceRange,
} from '../../../charting_library';
import Datafeed from './datafeed.js';
import { useEffect, useState } from 'react';
import { getNetwork } from '../../../constants/networks/index';


export interface ChartContainerProps {
	asset: any;
	pendingLine: any;
}

function getLanguageFromURL(): LanguageCode | null {
	const regex = new RegExp('[\\?&]lang=([^&#]*)');
	const results = regex.exec(location.search);
	return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' ')) as LanguageCode;
}

export const TVChartContainer = ({ asset, pendingLine }: ChartContainerProps) => {

	const widgetOptions: ChartingLibraryWidgetOptions = {
		symbol: getNetwork(0).assets[asset].name as string,
		// tslint:disable-next-line:no-any
		datafeed: Datafeed,
		interval: '1' as ResolutionString,
		container: 'tv_chart_container',
		library_path: '/charting_library/' as string,

		locale: getLanguageFromURL() || 'en',
		disabled_features: ['use_localstorage_for_settings', 'header_symbol_search', 'header_compare'],
		enabled_features: ['study_template'],
		charts_storage_api_version: '1.1',
		client_id: 'tradingview.com',
		user_id: 'public_user_id',
		fullscreen: false,
		autosize: true,
		studies_overrides: {},
		theme: 'Dark',
		overrides: {
			"paneProperties.background": "#17191D",
			"paneProperties.backgroundType": "solid",
			"scalesProperties.showSymbolLabels": true
		},
		custom_css_url: "css/style.css",
		toolbar_bg: '#17191D',
		loading_screen: { backgroundColor: "#17191D" }
	};
	const [tvWidget, setTVWidget] = useState<IChartingLibraryWidget>();

	useEffect(() => {
		localStorage.setItem("LastPairSelected", asset);
		let _widget = new widget(widgetOptions);
		setTVWidget(_widget);
		_widget.onChartReady(() => {
			if (localStorage.getItem("StoredChart" + asset)) {
				_widget.load(JSON.parse(localStorage.getItem("StoredChart" + asset) as string));
			} else {
				_widget.save((data) => {
					localStorage.setItem("StoredChart" + asset, JSON.stringify(data));
				});
			}
			setInterval(() => {
				_widget.save((data) => {
					localStorage.setItem("StoredChart" + asset, JSON.stringify(data));
				});
			}, 5000);
		});
	}, []);

	useEffect(() => {
		localStorage.setItem("LastPairSelected", asset);
		try {
			tvWidget?.setSymbol(getNetwork(0).assets[asset].name as string, tvWidget?.symbolInterval().interval as ResolutionString, () => { });
			tvWidget?.chart().removeAllShapes();
			tvWidget?.save((data) => {
				localStorage.setItem("StoredChart" + asset, JSON.stringify(data));
			});
		} catch {
			setTVWidget(new widget(widgetOptions));
		}

	}, [asset]);

	useEffect(() => {
		if (pendingLine == 0) {
			tvWidget?.chart().removeAllShapes();
			return;
		}
		tvWidget?.chart().createShape({ price: pendingLine, time: 0 }, { shape: "horizontal_line", text: "Opening price" });
	}, [pendingLine]);

	return (
		<div
			className={'TVChartContainer'}
			id={'tv_chart_container'}
		/>
	);

}
export default TVChartContainer;