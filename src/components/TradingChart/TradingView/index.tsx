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
	PricedPoint,
	ShapePoint,
	SetVisibleTimeRange
} from '../../../charting_library';
import Datafeed from './datafeed.js';
import { useEffect, useState } from 'react';
import { getNetwork } from '../../../constants/networks/index';
import { oracleSocket } from 'src/context/socket';


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
		disabled_features: ['header_symbol_search', 'header_compare', 'use_localstorage_for_settings', 'header_settings'],
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
			"scalesProperties.showSymbolLabels": true,
			"rightOffset": 10

		},
		custom_css_url: "css/style.css",
		toolbar_bg: '#17191D',
		loading_screen: { backgroundColor: "#17191D" },
		drawings_access: {
			type: 'black',
		    tools: [
				{
					name: 'Font Icons',
					grayed: false
				}
			]
		}
	};
	const [tvWidget, setTVWidget] = useState<IChartingLibraryWidget>();

	const [oracleData, setOracleData] = useState<any>([{}]);
	const oracleRef = React.useRef(Array(35).fill({price: "0", spread: "0"}));
	useEffect(() => {
		oracleSocket.on('data', (data: any) => {
			if (
				(data[asset].price/1e18).toFixed(getNetwork(0).assets[asset].decimals) !== (oracleRef.current[asset].price/1e18).toFixed(getNetwork(0).assets[asset].decimals)
				|| data[asset].spread !== oracleRef.current[asset].spread) {
				setOracleData(data);
				oracleRef.current = data;
			}
		});
	}, []);

	function getSpreadPrices() {
		return ({
			ask: (oracleData.length > 0 && oracleData[asset] != null)
					?
				  (parseInt(oracleData[asset].price) - parseInt(oracleData[asset].price) * parseInt(oracleData[asset].spread)/1e10)/1e18
					:
				  2,
			bid: (oracleData.length > 0 && oracleData[asset] != null)
					?
				  (parseInt(oracleData[asset].price) + parseInt(oracleData[asset].price) * parseInt(oracleData[asset].spread)/1e10)/1e18
					:
				  2
		  });	
	}

	useEffect(() => {
		localStorage.setItem("LastPairSelected", asset);
		let _widget = new widget(widgetOptions);
		setTVWidget(_widget);
		_widget.onChartReady(() => {
			_widget.chart().setVisibleRange({from: Date.now()/1000 - 7500, to: Date.now()/1000 + 1000});
		});
	}, []);

	useEffect(() => {
		localStorage.setItem("LastPairSelected", asset);
		try {
			tvWidget?.setSymbol(getNetwork(0).assets[asset].name as string, tvWidget?.symbolInterval().interval as ResolutionString, () => { });
		} catch {
			setTVWidget(new widget(widgetOptions));
		}
	}, [asset]);

	useEffect(() => {
		if (pendingLine == 0) {
			try {
			tvWidget?.chart()?.removeAllShapes();
				return;
			} catch {
				return;
			}
		}
		tvWidget?.chart().createShape({ price: pendingLine, time: 0 }, { shape: "horizontal_line", text: "Opening price" });
	}, [pendingLine]);

	const [BidLine, setBidLine] = useState<any>(null);
	const [AskLine, setAskLine] = useState<any>(null);

	useEffect(() => {
		if (tvWidget != undefined) {
			try {
				tvWidget.activeChart().getShapeById(BidLine)?.setPoints([{price: getSpreadPrices().bid}] as unknown as ShapePoint[]);
				tvWidget.activeChart().getShapeById(AskLine)?.setPoints([{price: getSpreadPrices().ask}] as unknown as ShapePoint[]);
			} catch {
				try {
					tvWidget.chart().removeAllShapes();
					setBidLine(tvWidget.activeChart().createShape(
						{ 
							time: 0, 
							price: getSpreadPrices().bid
						}, 
						{ 
							shape: 'horizontal_line', 
							lock: true,
							disableSelection: true,
							overrides: {
								showPrice: true,
								linestyle: 2,
								linewidth: 1,
								linecolor: "#26A69A",
								showLabel: true,
								text: "BID",
								textcolor: "#26A69A",
								horzLabelsAlign: "right",
								vertLabelsAlign: "bottom",
								fontsize: "12",
							} 
						}
					));
					setAskLine(tvWidget.activeChart().createShape(
						{ 
							time: 0, 
							price: getSpreadPrices().ask
						}, 
						{ 
							shape: 'horizontal_line', 
							lock: true,
							disableSelection: true,
							overrides: {
								showPrice: true,
								linestyle: 2,
								linewidth: 1,
								linecolor: "#EF534F",
								showLabel: true,
								text: "ASK",
								textcolor: "#EF534F",
								horzLabelsAlign: "right",
								vertLabelsAlign: "top",
								fontsize: "12"
							} 
						}
					));
				} catch {}
			}
		}
	}, [oracleData]);

	return (
		<div
			className={'TVChartContainer'}
			id={'tv_chart_container'}
		/>
	);

}
export default TVChartContainer;