/* eslint-disable */
import { useRef } from 'react';
import './src/index.css';
import {
	widget,
	ChartingLibraryWidgetOptions,
	LanguageCode,
	ResolutionString,
	EntityId
} from '../../../charting_library';
import Datafeed from './datafeed.js';
import { useEffect, useContext } from 'react';
import { getNetwork } from '../../../constants/networks/index';
import { oracleSocket } from '../../../../src/context/socket';

export interface ChartContainerProps {
	asset: any;
	positionData: any;
}

function getLanguageFromURL(): LanguageCode | null {
	const regex = new RegExp('[\\?&]lang=([^&#]*)');
	const results = regex.exec(location.search);
	return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' ')) as LanguageCode;
}

export const TVChartContainer = ({ asset, positionData}: ChartContainerProps) => {

	const posData = positionData;

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
	const tvWidget = useRef<any>(null);

	useEffect(() => {
		localStorage.setItem("LastPairSelected", asset);
		let _widget = new widget(widgetOptions);
		tvWidget.current = _widget;
		_widget.onChartReady(() => {
			_widget.chart().setVisibleRange({from: Date.now()/1000 - 7500, to: Date.now()/1000 + 1000});
		});
	}, []);

	useEffect(() => {
		currentAsset.current = asset;
		localStorage.setItem("LastPairSelected", asset);
		try {
			tvWidget.current?.setSymbol(getNetwork(0).assets[asset].name as string, tvWidget.current?.symbolInterval().interval as ResolutionString, () => { });
		} catch(err) {
			tvWidget.current = new widget(widgetOptions);
		}
	}, [asset]);

	const BidLine = useRef<any>(null);
	const AskLine = useRef<any>(null);
	const currentAsset = useRef<any>(null);

	useEffect(() => {
		tvWidget.current.onChartReady(() => {
			oracleSocket.on('data', (data: any) => {
				const spreadPrices = {
					ask: (parseInt(data[currentAsset.current].price) - parseInt(data[currentAsset.current].price) * parseInt(data[currentAsset.current].spread)/1e10)/1e18,
					bid: (parseInt(data[currentAsset.current].price) + parseInt(data[currentAsset.current].price) * parseInt(data[currentAsset.current].spread)/1e10)/1e18
				}
				try {
					tvWidget.current.chart().removeEntity(BidLine.current);
					tvWidget.current.chart().removeEntity(AskLine.current);
					BidLine.current = tvWidget.current.chart().createShape(
						{ 
							time: 0, 
							price: spreadPrices.bid
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
								fontsize: "11",
							} 
						}
					);
					AskLine.current = tvWidget.current.chart().createShape(
						{ 
							time: 0,
							price: spreadPrices.ask
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
								fontsize: "11"
							} 
						}
					);
				} catch(err) {}
			});
		});
	}, []);

	const posLines = useRef<EntityId[]>([]);
	useEffect(() => {
		tvWidget.current.onChartReady(() => {
			posLines.current.forEach(line => {
				try {
					tvWidget.current.chart().removeEntity(line);
					posLines.current = [];
				} catch {}
			});
			for (let i=0; i<positionData.openPositions.length; i++) {
				if (positionData.openPositions[i].asset === asset) {
					posLines.current.push(tvWidget.current.chart().createShape(
						{ 
							time: 0, 
							price: parseFloat(positionData.openPositions[i].price)/1e18
						}, 
						{ 
							shape: 'horizontal_line', 
							lock: true,
							disableSelection: true,
							overrides: {
								showPrice: false,
								linestyle: 0,
								linewidth: 1,
								linecolor: "#FFFFFF",
								showLabel: true,
								text: (parseFloat(positionData.openPositions[i].leverage)/1e18).toFixed(1) + (positionData.openPositions[i].direction ? "x LONG ID " : "x SHORT ID ") + positionData.openPositions[i].id,
								textcolor: "#FFFFFF",
								horzLabelsAlign: "right",
								vertLabelsAlign: "bottom",
								fontsize: "11",
							} 
						}
					));
					if (parseFloat(positionData.openPositions[i].slPrice) !== 0) {
						posLines.current.push(tvWidget.current.chart().createShape(
							{ 
								time: 0, 
								price: parseFloat(positionData.openPositions[i].slPrice)/1e18
							}, 
							{ 
								shape: 'horizontal_line', 
								lock: true,
								disableSelection: true,
								overrides: {
									showPrice: false,
									linestyle: 0,
									linewidth: 1,
									linecolor: "#EF534F",
									showLabel: true,
									text: "STOP LOSS ID " + positionData.openPositions[i].id,
									textcolor: "#EF534F",
									horzLabelsAlign: "right",
									vertLabelsAlign: "top",
									fontsize: "11",
								} 
							}
						));
					}
					if (parseFloat(positionData.openPositions[i].tpPrice) !== 0) {
						posLines.current.push(tvWidget.current.chart().createShape(
							{ 
								time: 0, 
								price: parseFloat(positionData.openPositions[i].tpPrice)/1e18
							}, 
							{ 
								shape: 'horizontal_line', 
								lock: true,
								disableSelection: true,
								overrides: {
									showPrice: false,
									linestyle: 0,
									linewidth: 1,
									linecolor: "#26A69A",
									showLabel: true,
									text: "TAKE PROFIT ID " + positionData.openPositions[i].id,
									textcolor: "#26A69A",
									horzLabelsAlign: "right",
									vertLabelsAlign: "bottom",
									fontsize: "11",
								} 
							}
						));
					}
					posLines.current.push(tvWidget.current.chart().createShape(
						{ 
							time: 0, 
							price: parseFloat(positionData.openPositions[i].liqPrice)/1e18
						}, 
						{ 
							shape: 'horizontal_line', 
							lock: false,
							disableSelection: true,
							overrides: {
								showPrice: false,
								linestyle: 0,
								linewidth: 1,
								linecolor: "yellow",
								showLabel: true,
								text: "LIQ ID " + positionData.openPositions[i].id,
								textcolor: "yellow",
								horzLabelsAlign: "right",
								vertLabelsAlign: "bottom",
								fontsize: "11",
							} 
						}
					));
				}
			}
		});
	}, [posData, asset]);

	return (
		<div
			className={'TVChartContainer'}
			id={'tv_chart_container'}
		/>
	);

}
export default TVChartContainer;