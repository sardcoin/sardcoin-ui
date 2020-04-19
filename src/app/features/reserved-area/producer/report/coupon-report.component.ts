import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import * as _ from 'lodash';
import { getMonth } from 'ngx-bootstrap/chronos';
import {getDay, getFullYear} from 'ngx-bootstrap/chronos/utils/date-getters';
import { Breadcrumb } from '../../../../core/breadcrumb/Breadcrumb';
import { BreadcrumbActions } from '../../../../core/breadcrumb/breadcrumb.actions';
import { ReportService } from '../../../../shared/_services/report.service';
import { UserService } from '../../../../shared/_services/user.service';
import {el} from '@angular/platform-browser/testing/src/browser_util';

@Component({
  selector: 'app-feature-reserved-area-producer-report',
  templateUrl: './coupon-report.component.html',
  styleUrls: ['./coupon-report.component.scss']
})
export class FeatureReservedAreaProducerCouponReportComponent implements OnInit, OnDestroy {

  loading = true;

  range = [];
  rangeSelected: any;
  rangeMonth = [];
  rangeMonthPrev: any;
  rangeMonthCur: any;
  reportCoupons: any = null;
  reportCouponsYear: any = null;
  reportCouponsMonth: any = null;
  reportCouponsDay: any = null;

  reportCouponsWithBrokerMoney: any = null;
  reportCouponsWithBrokerYearMoney: any = null;
  reportCouponsWithBrokerMonthMoney: any = null;
  reportCouponsWithBrokerDayMoney: any = null;

  reportCouponsWithBrokerQuantity: any = null;
  reportCouponsWithBrokerYearQuantity: any = null;
  reportCouponsWithBrokerMonthQuantity: any = null;
  reportCouponsWithBrokerDayQuantity: any = null;

  reportBrokerQuantity: any = null;
  reportBrokerYearQuantity: any = null;
  reportBrokerMonthQuantity: any = null;
  reportBrokerDayQuantity: any = null;

  cProfitsChart = {
    chartType: 'AreaChart',
    dataTable: [],
    options: {
      legend: true,
      chart: {
        title: 'Ricavi',
        subtitle: 'Ricavi ottenuti dal producer nel mese corrente'
      },
      hAxis: {minValue: 1, gridlines: {color: 'transparent'}, textStyle: {color: '#999', fontName: 'Roboto'}, minTextSpacing: 15, title: 'Giorni mese corrente'},
      vAxis: {
        viewWindowMode: 'explicit',
        minValue: 0,
        viewWindow: {min: 0},
        baseline: { color: '#F6F6F6'},
        gridlines: {color: '#eaeaea', count: 5},
        textPosition: 'out',
        textStyle: {color: '#999'},
        format: '#',
        title: 'Valore coupon venduti'
      },
      chartArea: {left: 75, right: 100, height: 250, top: 25},
      width: 550,
      height: 400,
      responsive: true,
      maintainAspectRatio: false,
      colors: ['#CC3300']
    }
  };

  pProfitsChart = {
    chartType: 'AreaChart',
    dataTable: [],
    options: {
      legend: true,
      chart: {
        title: 'Ricavi',
        subtitle: 'Ricavi ottenuti dal producer nel mese precedente'
      },
      hAxis: {minValue: 1, gridlines: {color: 'transparent'}, textStyle: {color: '#999', fontName: 'Roboto'}, minTextSpacing: 15, title: 'Giorni mese precedente'},
      vAxis: {
        viewWindowMode: 'explicit',
        minValue: 0,
        viewWindow: {min: 0},
        baseline: { color: '#F6F6F6'},
        gridlines: {color: '#eaeaea', count: 5},
        textPosition: 'out',
        textStyle: {color: '#999'},
        format: '#',
        title: 'Valore coupon venduti'
      },
      chartArea: {left: 75, right: 100, height: 250, top: 25},
      width: 550,
      height: 400,
      responsive: true,
      maintainAspectRatio: false,
      colors: ['#333F50']
    }
  };

  couponsBougth = {
    chartType: 'ColumnChart',
    dataTable: [],
    options: {
      legend: true,
      chart: {
        title: 'Numero coupon',
        subtitle: 'Numero coupon venduti nell\'anno corrente'
      },
      hAxis: {},
      vAxis: {gridlines: {color: '#eaeaea', count: 5}, textPosition: 'out', textStyle: {color: '#999'}, format: '#', title: 'Numero coupon venduti'},
      chartArea: {left: 75, right: 100, height: 250, top: 25},
      width: 550,
      height: 400,
      responsive: true,
      maintainAspectRatio: false,
      colors: ['#333F50']
    }
  };
  consumerPerc = {
    chartType: 'PieChart',
    dataTable: [],
    options: {
      legend: true,
      title: 'Consumer divisi in:',
      subtitle: 'Percentuale di consumer che hanno fatto un acquisto sul totale',
      // slices: {
      //   0: {offset: 0.3},
      //   1: {offset: 0.2}
      // },
      hAxis: {},
      vAxis: {},
      chartArea: {left: 100, right: 0, height: 290, top: 20},
      width: 550,
      height: 400,
      sliceVisibilityThreshold: 0.05,
      pieHole: 0.55,
      pieSliceText: 'percentage',
      pieSliceTextStyle: {fontSize: 12, color: 'white'},
      responsive: true,
      maintainAspectRatio: false,
      colors: ['#333F50', '#CC3300']
    }
  };

  purchFreq = {
    chartType: 'LineChart',
    dataTable: [],
    options: {
      legend: true,
      // slices: {
      //   0: {offset: 0.3},
      //   1: {offset: 0.2}
      // },
      hAxis: {minValue: 1, gridlines: {color: 'transparent'}, textStyle: {color: '#999', fontName: 'Roboto'}, minTextSpacing: 15},
      vAxis: {minValue: 0, gridlines: {color: '#eaeaea', count: 5}, textPosition: 'out', textStyle: {color: '#999'}, format: '#', title: 'Valore'},
      chartArea: {left: 75, right: 100, height: 250, top: 25},
      width: 550,
      height: 400,
      // bar: {groupWidth: '20%'},
      responsive: true,
      maintainAspectRatio: false,
      colors: ['#333F50', '#CC3300']
    }
  };

  couponsBroker = {
    chartType: 'ColumnChart',
    dataTable: [],
    options: {
      legend: {position: 'none'},
      chart: {
        title: 'Numero coupon venduti',
        subtitle: 'Numero coupon venduti da producer e broker'
      },
      hAxis: {},
      vAxis: {minValue: 0, gridlines: {color: '#eaeaea', count: 5}, textPosition: 'out', textStyle: {color: '#999'}, format: '#', title: 'Numero coupon venduti'},
      chartArea: {left: 75, right: 100, height: 250, top: 25},
      width: 550,
      height: 400,
      bar: {groupWidth: '50%'},
      responsive: true,
      maintainAspectRatio: false
    }
  };

  // areaDataAvailable = (): boolean =>
  //   this.cProfitsChart.dataTable.length > 0 &&
  //   this.barChartForBoughtProducerMoney.dataTable.length > 0 &&
  //   this.barChartForBoughtProducerQuantity.dataTable.length > 0 &&
  //   this.barChartForBoughtBrokersQuantity.dataTable.length > 0;

  constructor(
    private breadcrumbActions: BreadcrumbActions,
    private reportService: ReportService,
    private userService: UserService
  ) {
      this.loadCoupons();
  }

  ngOnInit() {
    this.addBreadcrumb();
  }

  ngOnDestroy() {
    this.removeBreadcrumb();
  }

  addBreadcrumb() {
    const bread = [] as Array<Breadcrumb>;

    bread.push(new Breadcrumb('Home', '/'));
    bread.push(new Breadcrumb('Report', '/reserved-area/producer/report'));

    this.breadcrumbActions.updateBreadcrumb(bread);
  }

  removeBreadcrumb() {
    this.breadcrumbActions.deleteBreadcrumb();
  }

  loadCoupons(year = null) {
    this.reportService.getReportBoughtProducerCoupons()
      .subscribe(couponsBougth => {
        this.range.push(new Date().getFullYear());
        couponsBougth.forEach(el => this.range.includes(new Date(el.timestamp).getFullYear()) ? null : this.range.push(new Date(el.timestamp).getFullYear()));
        const yearCoup = year ? year : new Date().getFullYear();
        this.reportCoupons = couponsBougth.filter(el => new Date(el.timestamp).getFullYear() === yearCoup);
        this.rangeSelected = yearCoup;
        this.setRangeMonth();

        this.previousProfitsChart();
        this.currentProfitsChart();
        this.couponsBougthChart();
        this.consumerPercChart();
        this.purchFreqChart();
        this.couponsBrokerChart();
        this.loading = false;
      });
  }

  setRangeMonth() {
    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    let date;

    for (let i = 0; i <= month; i++) {
      date = new Date(year, i);
      this.rangeMonth.push(date.toLocaleString('default', { month: 'long' }));
    }
  }

  currentProfitsChart(month = null) {
    const year = new Date().getFullYear();
    // @ts-ignore
    let monthCoup = month ? document.getElementById("selectCurrent").selectedIndex + 1 : new Date().getMonth() + 1;
    monthCoup = new Date(year, monthCoup).getMonth();
    const date = new Date(year, monthCoup, -1);
    const nameMonth = date.toLocaleString('default', { month: 'long' });

    this.rangeMonthCur = nameMonth;
    const day = date.getDate();
    let price = 0;
    let coupons = [];
    const chartData = [];
    const header = [['Giorni mese corrente', nameMonth.toUpperCase()]];
      if (this.reportCoupons) {
        coupons = this.reportCoupons.filter(el => new Date(el.timestamp).getFullYear() === year);
        coupons = coupons.filter(el => new Date(el.timestamp).getMonth() + 1 === monthCoup);
        for (let i = 0; i <= day; i++) {
          coupons.forEach(el => (new Date(el.timestamp).getDate()) === i + 1 ? price += el.price : 0);
          chartData.push([i + 1, price]);
          price = 0;
        }
        this.cProfitsChart.dataTable = header.concat(chartData);
        this.cProfitsChart = Object.create(this.cProfitsChart);
      }
  }

  previousProfitsChart(month = null) {
    const year = new Date().getFullYear();
    // @ts-ignore
    let monthCoup = month ? document.getElementById("selectPrev").selectedIndex + 1 : new Date().getMonth();
    monthCoup = new Date(year, monthCoup).getMonth();    const date = new Date(year, monthCoup, -1);
    const nameMonth = date.toLocaleString('default', { month: 'long' });
    this.rangeMonthPrev = nameMonth;
    const day = date.getDate();
    let coupons = [];
    let price = 0;
    const chartData = [];
    const header = [['Giorni mese precedente', nameMonth.toUpperCase()]];

        if (this.reportCoupons) {
          coupons = this.reportCoupons.filter(el => new Date(el.timestamp).getFullYear() === year);
          coupons = coupons.filter(el => new Date(el.timestamp).getMonth() + 1 === monthCoup);
          for (let i = 0; i <= day; i++) {
            coupons.forEach(el => (new Date(el.timestamp).getDate()) === i + 1 ? price += el.price : 0);
            chartData.push([i + 1, price]);
            price = 0;
          }
          this.pProfitsChart.dataTable = header.concat(chartData);
          this.pProfitsChart = Object.create(this.pProfitsChart);
        }
  }

  couponsBougthChart() {
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    let nameMonth = '';
    let nCoupons = 0;
    let coupons = [];
    const chartData = [];
    const header = [['Mesi', 'Coupon venduti']];
    if (this.reportCoupons) {
      coupons = this.reportCoupons.filter(el => new Date(el.timestamp).getFullYear() === year);
      for (let i = 1; i <= month; i++) {
        nameMonth = new Date(year, i, -1).toLocaleString('default', { month: 'long' });
        coupons.forEach(el => (new Date(el.timestamp).getMonth()) + 1 === i ? nCoupons++ : 0);
        chartData.push([nameMonth, nCoupons]);
        nCoupons = 0;
      }
      this.couponsBougth.dataTable = header.concat(chartData);
      this.couponsBougth = Object.create(this.couponsBougth);
    }
  }

  consumerPercChart() {
    const year = new Date().getFullYear();
    let nConsumer = 0;
    const coupons = [];
    const chartData = [];
    const header = [['Label', 'Consumer']];
    if (this.reportCoupons) {
      this.reportCoupons.forEach(el => new Date(el.timestamp).getFullYear() === year ? coupons.push(el['consumer']) : null);
      this.userService.getConsumers()
        .subscribe(consumers => {
          nConsumer = coupons.filter((v, i, a) => a.indexOf(v) === i).length;
          chartData.push(['Consumer che hanno acquistato', nConsumer]);
          chartData.push(['Consumer che non hanno acquistato', consumers.length - nConsumer]);
          this.consumerPerc.dataTable = header.concat(chartData);
          this.consumerPerc = Object.create(this.consumerPerc);
        });
    }
  }

  purchFreqChart() {
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;

    let nameMonth = '';
    let price = 0;
    let freq = 0;

    let couponsMonth = [];
    let coupons = [];
    let consumers = [];
    const idConsum = [];
    const chartData = [];
    const header = [['Label', 'Ricavo', 'Frequenza d\'acquisto']];
    if (this.reportCoupons) {
      this.userService.getConsumers()
        .subscribe(cons => {
          coupons = this.reportCoupons.filter(el => new Date(el.timestamp).getFullYear() === year);
          for (let i = 1; i <= month; i++) {
            nameMonth = new Date(year, i, -1).toLocaleString('default', { month: 'long' });
            coupons.forEach(el => (new Date(el.timestamp).getMonth()) + 1  === i ? (price += el.price, couponsMonth.push(el)) : 0);

            couponsMonth.forEach(el => el ? idConsum.push(el.consumer) : null);
            consumers = cons.filter(el => idConsum.includes(el.id));
            freq = consumers.length === 0 ? 0 : couponsMonth.length / consumers.length;
            chartData.push([nameMonth, price, freq]);

            couponsMonth = [];
            price = 0;
            freq = 0;
          }
          this.purchFreq.dataTable = header.concat(chartData);
          this.purchFreq = Object.create(this.purchFreq);
        });
    }
  }

  couponsBrokerChart() {
    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    const day = new Date(year, month, -1).getDate();

    let coupons = [];
    let broker = 0, producer = 0;
    const chartData = [];
    const header = [['Venditore', 'Coupon venduti', { role: 'style' }]];
    if (this.reportCoupons) {
      coupons = this.reportCoupons.filter(el => new Date(el.timestamp).getFullYear() === year);
      producer = (coupons.filter(el => el.package === null)).length;
      broker = (coupons.filter(el => el.package !== null)).length;
      chartData.push(['Producer', producer, 'color: #333F50']);
      chartData.push(['Broker', broker, 'color: #CC3300']);
      this.couponsBroker.dataTable = header.concat(chartData);
      this.couponsBroker = Object.create(this.couponsBroker);
    }
  }


/*
  groupBy(xs, key) {

    if (xs) {
      return xs.reduce(function(rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);

        return rv;
      }, {});
    } else {
      return null;
    }
  }

  ChangingRange(event?) {
    if (event) {
      this.rangeSelected = event.target.value;
    } else {
      this.rangeSelected = this.range[0];
    }
    switch (this.rangeSelected) {

      case 'year': {
        this.reportCoupons = this.reportCouponsYear;
        this.reportCouponsWithBrokerMoney = this.reportCouponsWithBrokerYearMoney;
        this.reportCouponsWithBrokerQuantity = this.reportCouponsWithBrokerYearQuantity;
        this.reportBrokerQuantity = this.reportCouponsWithBrokerYearQuantity;

        break;
      }
      case  'month': {
        this.reportCoupons = this.reportCouponsMonth;
        this.reportCouponsWithBrokerMoney = this.reportCouponsWithBrokerMonthMoney;
        this.reportCouponsWithBrokerQuantity = this.reportCouponsWithBrokerMonthQuantity;
        this.reportBrokerQuantity = this.reportCouponsWithBrokerMonthQuantity;

        break;
      }
      case  'day': {
        this.reportCoupons = this.reportCouponsDay;
        this.reportCouponsWithBrokerMoney = this.reportCouponsWithBrokerDayMoney;
        this.reportCouponsWithBrokerQuantity = this.reportCouponsWithBrokerDayQuantity;
        this.reportBrokerQuantity = this.reportCouponsWithBrokerDayQuantity;

        break;
      }
      case '0: year': {
        this.reportCoupons = this.reportCouponsYear;
        this.reportCouponsWithBrokerMoney = this.reportCouponsWithBrokerYearMoney;
        this.reportCouponsWithBrokerQuantity = this.reportCouponsWithBrokerYearQuantity;
        this.reportBrokerQuantity = this.reportCouponsWithBrokerYearQuantity;

        break;
      }
      case  '1: month': {
        this.reportCoupons = this.reportCouponsMonth;
        this.reportCouponsWithBrokerMoney = this.reportCouponsWithBrokerMonthMoney;
        this.reportCouponsWithBrokerQuantity = this.reportCouponsWithBrokerMonthQuantity;
        this.reportBrokerQuantity = this.reportCouponsWithBrokerMonthQuantity;

        break;
      }
      case  '2: day': {
        this.reportCoupons = this.reportCouponsDay;
        this.reportCouponsWithBrokerMoney = this.reportCouponsWithBrokerDayMoney;
        this.reportCouponsWithBrokerQuantity = this.reportCouponsWithBrokerDayQuantity;
        this.reportBrokerQuantity = this.reportCouponsWithBrokerDayQuantity;

        break;
      }
      default: { // year or day or month
        this.reportCoupons = this.reportCouponsDay;
        this.reportCouponsWithBrokerMoney = this.reportCouponsWithBrokerYearMoney;
        this.reportCouponsWithBrokerQuantity = this.reportCouponsWithBrokerYearQuantity;
        this.reportBrokerQuantity = this.reportCouponsWithBrokerYearQuantity;

      }
    }
    this.setBarChart(this.reportCoupons, this.rangeSelected);
    this.setPieChart(this.reportCouponsWithBrokerMoney, this.rangeSelected);
    this.setBarChartBoughtProducerBrokerMoney(this.reportCouponsWithBrokerMoney, this.rangeSelected);
    this.setBarChartBoughtProducerBrokerQuantity(this.reportCouponsWithBrokerQuantity, this.rangeSelected);
    this.setBarChartBoughtForBrokerQuantity(this.reportBrokerQuantity, this.rangeSelected);
  }

  setBarChart(report, range) {
    if (range == 'year' || range == '0: year') {
      this.cProfitsChart.dataTable = this.convertJsonToArrayForBar(report, range);
      // this.cProfitsChart.options.chart.subtitle = 'Raggruppamento per stato e per anno';
      this.cProfitsChart = Object.create(this.cProfitsChart);

    } else if (range == 'month' || range == '1: month') {
      this.cProfitsChart.dataTable = this.convertJsonToArrayForBar(report, range);
      // this.cProfitsChart.options.chart.subtitle = 'Raggruppamento per stato e per mese dell\'anno corrente';
      this.cProfitsChart = Object.create(this.cProfitsChart);

    } else {
      this.cProfitsChart.dataTable = this.convertJsonToArrayForBar(report, range);
      // this.cProfitsChart.options.chart.subtitle = 'Raggruppamento per stato e per giorno del mese corrente';
      this.cProfitsChart = Object.create(this.cProfitsChart);

    }
  }

  setBarChartBoughtProducerBrokerMoney(report, range) {
    if (range == 'year' || range == '0: year') {
      this.barChartForBoughtProducerMoney.dataTable = this.convertJsonToArrayForBoughtProducerMoney(report, range);
      this.barChartForBoughtProducerMoney.options.chart.subtitle = 'Ricavi totali raggruppati per anno, con o senza broker.';
      this.barChartForBoughtProducerMoney = Object.create(this.barChartForBoughtProducerMoney);

    } else if (range == 'month' || range == '1: month') {
      this.barChartForBoughtProducerMoney.dataTable = this.convertJsonToArrayForBoughtProducerMoney(report, range);
      this.barChartForBoughtProducerMoney.options.chart.subtitle = 'Ricavi totali raggruppati per mese dell\'anno corrente, con o senza broker.';
      this.barChartForBoughtProducerMoney = Object.create(this.barChartForBoughtProducerMoney);

    } else {
      this.barChartForBoughtProducerMoney.dataTable = this.convertJsonToArrayForBoughtProducerMoney(report, range);
      this.barChartForBoughtProducerMoney.options.chart.subtitle = 'Ricavi totali raggruppati per giorno del mese corrente, con o senza broker.';
      this.barChartForBoughtProducerMoney = Object.create(this.barChartForBoughtProducerMoney);

    }
  }

  setBarChartBoughtProducerBrokerQuantity(report, range) {
    if (range == 'year' || range == '0: year') {
      this.barChartForBoughtProducerQuantity.dataTable = this.convertJsonToArrayForBoughtProducerQuantity(report, range);
      this.barChartForBoughtProducerQuantity.options.chart.subtitle = 'Coupon venduti raggruppati per anno, con o senza broker.';
      this.barChartForBoughtProducerQuantity = Object.create(this.barChartForBoughtProducerQuantity);

    } else if (range == 'month' || range == '1: month') {
      this.barChartForBoughtProducerQuantity.dataTable = this.convertJsonToArrayForBoughtProducerQuantity(report, range);
      this.barChartForBoughtProducerQuantity.options.chart.subtitle = 'Coupon venduti raggruppati per mese dell\'anno corrente, con o senza broker.';
      this.barChartForBoughtProducerQuantity = Object.create(this.barChartForBoughtProducerQuantity);

    } else {
      this.barChartForBoughtProducerQuantity.dataTable = this.convertJsonToArrayForBoughtProducerQuantity(report, range);
      this.barChartForBoughtProducerQuantity.options.chart.subtitle = 'Coupon venduti raggruppati per giorno del mese corrente, con o senza broker.';
      this.barChartForBoughtProducerQuantity = Object.create(this.barChartForBoughtProducerQuantity);

    }

  }

  async setBarChartBoughtForBrokerQuantity(report, range) {
    if (range == 'year' || range == '0: year') {
      this.barChartForBoughtBrokersQuantity.dataTable = await this.convertJsonToArrayForBoughtBrokerQuantity(report, range);
      this.barChartForBoughtBrokersQuantity.options.chart.subtitle = 'Quantità di coupon venduti da ogni broker, raggruppati per anno';
      this.barChartForBoughtBrokersQuantity = Object.create(this.barChartForBoughtBrokersQuantity);

    } else if (range == 'month' || range == '1: month') {
      this.barChartForBoughtBrokersQuantity.dataTable = await this.convertJsonToArrayForBoughtBrokerQuantity(report, range);
      this.barChartForBoughtBrokersQuantity.options.chart.subtitle = 'Quantità di coupon venduti da ogni broker, raggruppati per mesi dell\'anno corrente';
      this.barChartForBoughtBrokersQuantity = Object.create(this.barChartForBoughtBrokersQuantity);

    } else {
      this.barChartForBoughtBrokersQuantity.dataTable = await this.convertJsonToArrayForBoughtBrokerQuantity(report, range);
      this.barChartForBoughtBrokersQuantity.options.chart.subtitle = 'Quantità di coupon venduti da ogni broker, raggruppati per giorni del mese corrente';
      this.barChartForBoughtBrokersQuantity = Object.create(this.barChartForBoughtBrokersQuantity);

    }
  }

  setPieChart(report, range) {
    this.pieChart = {
      chartType: 'PieChart',
      dataTable: [], // this.convertJsonToArrayForPie(report, range) da mettere
      options: {
        title: 'Coupons venduti ' + this.setTitlePie(range),
        slices: {
          0: {offset: 0.3},
          1: {offset: 0.2}
        }
      }
    };
    this.pieChart = Object.create(this.pieChart);

  }

  init() {

    this.reportService.getReportBoughtProducerCoupons().subscribe(couponsBougth => {
      if (couponsBougth) {
        this.reportCouponsWithBrokerYearMoney = _.groupBy(couponsBougth, 'year');
        this.reportCouponsWithBrokerYearQuantity = _.groupBy(couponsBougth, 'year');

        if (this.reportCouponsWithBrokerYearMoney) {
          this.reportCouponsWithBrokerMonthMoney = _.groupBy(this.reportCouponsWithBrokerYearMoney[getFullYear(new Date())], 'month');
          this.reportCouponsWithBrokerMonthQuantity = _.groupBy(this.reportCouponsWithBrokerYearQuantity[getFullYear(new Date())], 'month');

          if (this.reportCouponsWithBrokerMonthMoney) {
            this.reportCouponsWithBrokerDayMoney = _.groupBy(this.reportCouponsWithBrokerMonthMoney[getMonth(new Date()) + 1], 'day');
            this.reportCouponsWithBrokerDayQuantity = _.groupBy(this.reportCouponsWithBrokerMonthQuantity[getFullYear(new Date())], 'month');

          }
        }

        this.reportService.getReportProducerCoupons().subscribe(coupons => {
          if (coupons) {
            this.reportCouponsYear = this.groupBy(coupons, 'year');
            if (this.reportCouponsYear) {
              this.reportCouponsMonth = this.groupBy(this.reportCouponsYear[getFullYear(new Date())], 'month');
              if (this.reportCouponsMonth) {
                this.reportCouponsDay = this.groupBy(this.reportCouponsMonth[getMonth(new Date()) + 1], 'day');
              }
            }
          }
          this.loading = false;
          this.ChangingRange();
        });
      } else {
        this.loading = false;
      }
    });

  }

  convertJsonToArrayForBar(report, range) {

    if (!report) {
      return [];
    }

    const totalArray = [];
    let singleArray = [];
    singleArray = ['', 'Attivi', 'Venduti', 'Consumati', 'Scaduti'];
    totalArray.push(singleArray);
    for (const key in report) {
      let active = 0;
      let buyed = 0;
      let generated = 0;
      let verify = 0;
      let expired = 0;
      if (report.hasOwnProperty(key)) {
        for (const arr of report[key]) {
          active += arr.active;
          buyed += arr.bougth;
          generated += arr.generated;
          verify += arr.verify;
          expired += arr.expired;
        }
        singleArray = [this.convertDate(key.valueOf()), active.valueOf(), buyed.valueOf(), verify.valueOf(), expired.valueOf()];
        totalArray.push(singleArray);
      }
    }
    if (totalArray.length == 1) {
      return [['', 'Nessun Valore'], ['Nessun valore da visualizzare', 0]];
    }

    return totalArray;
  }

  convertJsonToArrayForPie(report, range) {
    if (!report) {
      return [];
    }
    const totalArray = [];
    let singleArray = [];
    singleArray = ['', ''];
    totalArray.push(singleArray);
    for (const key in report) {
      let broker = '';

      if (report.hasOwnProperty(key)) {
        for (const arr of report[key]) {
          broker = arr.username == undefined ? 'Senza Broker' : arr.username;
          singleArray = [broker, arr.buyed.valueOf()];
          totalArray.push(singleArray);
        }

      }
    }

    return totalArray;
  }

  convertJsonToArrayForBoughtProducerMoney(report, range) {
    if (!report) {
      return [];
    }
    const totalArray = [];
    let singleArray = [range == 'year' || range == '0: year' ?
      '' : range == 'month' || range == '1: month' ?
        '' : '',
      'Senza Broker', 'Con Broker'];
    totalArray.push(singleArray);
    const arrayHeader = [];

    for (const key in report) {
      let totalWithBroker = 0;
      let totalWithoutBroker = 0;

      if (report.hasOwnProperty(key)) {
        for (const arr of report[key]) {
          if (arr.package) {
            totalWithBroker += (arr.price * arr.bought);
          } else {

            totalWithoutBroker += (arr.price * arr.bought);
          }
        }

        singleArray = [this.convertDate(key.valueOf()), totalWithoutBroker,
          totalWithBroker];
        totalArray.push(singleArray);

      }
    }
    // totalArray.push(arrayHeader);
    // for (const key in report) {
    //   singleArray.push(key);
    //   //console.log('key', key)
    //   // singleArray.push(this.convertDate(key.valueOf())); for month
    //
    //   for (let i = 1; i < arrayHeader.length; i++) {
    //     singleArray.push('0');
    //   }
    //   if (report.hasOwnProperty(key)) {
    //
    //     for (let i = 0; i < report[key].length; i++) {
    //           const pack = report[key][i].package;
    //           const receipt = report[key][i].price;
    //
    //           for (let j = 0; j < arrayHeader.length; j++) {
    //             // //console.log('i', i, 'report[key][i].username', pack, 'j', j,  'arrayHeader[j]', arrayHeader[j]);
    //             if (pack ) {
    //
    //                 singleArray[j] = receipt;
    //               } else {
    //               singleArray[j] = receipt;
    //
    //             }
    //           }
    //     }
    //
    //   }
    //   totalArray.push(singleArray);
    //   singleArray = [];
    // }
    if (totalArray.length == 1) {
      return [['', 'Nessun Valore'], ['Nessun valore da visualizzare', 0]];
    }

    return totalArray;
  }

  async convertJsonToArrayForBoughtBrokerQuantity(report, range) {
    if (!report) {
      return [];
    }
    const totalArray = [];
    const singleArrayHeader = [range == 'year' || range == '0: year' ?
      '' : range == 'month' || range == '1: month' ?
        '' : ''];
    for (const key in report) {
      if (report.hasOwnProperty(key)) {
        for (const arr of report[key]) {
          if (arr.package) {
            const br = await this.reportService.getBrokerFromCouponId(arr.coupon_id).toPromise();
            if (br) {
              if (singleArrayHeader.indexOf(br.username) === -1) {
                singleArrayHeader.push(br.username);
                // singleArray.push(arr.bought);
              }
            }
          }
        }
      }
    }
    totalArray.push(singleArrayHeader);
    let arrayData = [];
    for (const i of singleArrayHeader) {
      arrayData.push(0);
    }
    const singleArray = arrayData;
    for (const key in report) {
      arrayData[0] = this.convertDate(key.valueOf());

      if (report.hasOwnProperty(key)) {
        for (const arr of report[key]) {
          if (arr.package !== null) {
            const br = await this.reportService.getBrokerFromCouponId(arr.coupon_id).toPromise();
            if (br) {
              if (arrayData[singleArrayHeader.indexOf(br.username)] == 0) {
                arrayData[singleArrayHeader.indexOf(br.username)] = arr.bought;
              } else {
                const actual = Number(arrayData[singleArrayHeader.indexOf(br.username)]);
                const now = Number(arr.bought);
                const current = actual + now;
                arrayData[singleArrayHeader.indexOf(br.username)] = current;
              }
            }
          }
        }
        totalArray.push(arrayData);
        arrayData = [];
        for (const i of singleArrayHeader) {
          arrayData.push(0);
        }
      }

    }

    if (totalArray.length == 1) {
      return [['', 'Nessun Valore'], ['Nessun valore da visualizzare', 0]];
    }

    return totalArray;
  }

  convertJsonToArrayForBoughtProducerQuantity(report, range) {
    if (!report) {
      return [];
    }
    const totalArray = [];
    let singleArray = [range == 'year' || range == '0: year' ?
      '' : range == 'month' || range == '1: month' ?
        '' : '', 'Senza Broker', 'Con Broker'];
    totalArray.push(singleArray);
    const arrayHeader = [];

    for (const key in report) {
      let totalWithBroker = 0;
      let totalWithoutBroker = 0;

      if (report.hasOwnProperty(key)) {
        for (const arr of report[key]) {
          if (arr.package) {
            totalWithBroker += arr.bought;
          } else {

            totalWithoutBroker += arr.bought;
          }
        }

        singleArray = [this.convertDate(key.valueOf()), totalWithoutBroker,
          totalWithBroker];
        totalArray.push(singleArray);

      }
    }

    if (totalArray.length == 1) {
      return [['', 'Nessun Valore'], ['Nessun valore da visualizzare', 0]];
    }

    return totalArray;
  }

  setTitlePie(range) {

    if (range == 'year' || range == '0: year') {
      return ' totali';
    }
    if (range == 'month' || range == '1: month') {
      return ' nell\' anno';
    }
    if (range == 'day' || range == '2: day') {
      return ' nel mese';
    }

  }

  translate(item) {
    switch (item) {

      case 'year':
        return 'Tutti i coupon';
      case  'month':
        return 'Anno corrente';
      case 'day':
        return 'Mese corrente';

    }
  }

  convertDate(range) {
    if (this.reportCoupons == this.reportCouponsMonth) {
      switch (Number(range)) {
        case 1:
          return 'Gennaio';
        case 2:
          return 'Febbraio';
        case 3:
          return 'Marzo';
        case 4:
          return 'Aprile';
        case 5:
          return 'Maggio';
        case 6:
          return 'Giugno';
        case 7:
          return 'Luglio';
        case 8:
          return 'Agosto';
        case 9:
          return 'Settembre';
        case 10:
          return 'Ottobre';
        case 11:
          return 'Novembre';
        case 12:
          return 'Dicembre';

      }
    } else {
      return range;
    }
  }
*/

  /*
    @HostListener('window:resize', ['$event'])
    onWindowResize = (event: any) => {
      if (event.target.innerWidth >= 1300) {
        this.cProfitsChart.options.width = 400;
        this.cProfitsChart.options.height = 300;
      } else {
        this.cProfitsChart.options.width = 300;
        this.cProfitsChart.options.height = 300;
      }
      this.cProfitsChart.component.draw();

      // this.barChart1.draw();
      // you can remove two lines that preserve selection if you don't need them
    };*/
}
