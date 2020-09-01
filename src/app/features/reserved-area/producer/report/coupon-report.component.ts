import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import * as _ from 'lodash';
import { getMonth } from 'ngx-bootstrap/chronos';
import {getDay, getFullYear} from 'ngx-bootstrap/chronos/utils/date-getters';
import { Breadcrumb } from '../../../../core/breadcrumb/Breadcrumb';
import { BreadcrumbActions } from '../../../../core/breadcrumb/breadcrumb.actions';
import { ReportService } from '../../../../shared/_services/report.service';
import { UserService } from '../../../../shared/_services/user.service';

@Component({
  selector: 'app-feature-reserved-area-producer-report',
  templateUrl: './coupon-report.component.html',
  styleUrls: ['./coupon-report.component.scss']
})
export class FeatureReservedAreaProducerCouponReportComponent implements OnInit, OnDestroy {

  loading = true;

  show = 0;

  range = [];
  rangeSelected: any;
  rangeMonth = [];
  rangeMonthPrev: any;
  rangeMonthCur: any;
  reportCoupons: any = null;

  cProfitsChart = {
    chartType: 'AreaChart',
    dataTable: [],
    options: {
      legend: true,
      chart: {
        title: 'Ricavi di vendita attuali',
        subtitle: 'Ricavi ottenuti dal producer nel mese selezionato'
      },
      hAxis: {minValue: 1, gridlines: {color: 'transparent'}, textStyle: {color: '#999', fontName: 'Roboto'}, minTextSpacing: 15, title: 'Giorni mese corrente'},
      vAxis: {
        viewWindowMode: 'explicit',
        minValue: 0,
        viewWindow: {min: 0},
        baseline: {color: '#F6F6F6'},
        gridlines: {color: '#eaeaea', count: 5},
        textPosition: 'out',
        textStyle: {color: '#999'},
        format: '#',
        title: 'Importo totale coupon venduti'
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
        title: 'Ricavi di vendita precedenti o passati',
        subtitle: 'Ricavi ottenuti dal producer nel mese selezionato'
      },
      hAxis: {minValue: 1, gridlines: {color: 'transparent'}, textStyle: {color: '#999', fontName: 'Roboto'}, minTextSpacing: 15, title: 'Giorni mese precedente'},
      vAxis: {
        viewWindowMode: 'explicit',
        minValue: 0,
        viewWindow: {min: 0},
        baseline: {color: '#F6F6F6'},
        gridlines: {color: '#eaeaea', count: 5},
        textPosition: 'out',
        textStyle: {color: '#999'},
        format: '#',
        title: 'Importo totale coupon venduti'
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
    chartType: 'ComboChart',
    dataTable: [],
    options: {
      legend: 'none',
      chart: {
        title: 'Numero coupon',
        subtitle: 'Numero coupon venduti nell\'anno corrente'
      },
      hAxis: {title: 'Mesi dell\'anno'},
      vAxis: {gridlines: {color: '#eaeaea', count: 5}, textPosition: 'out', textStyle: {color: '#999'}, format: '#', title: 'Numero coupon'},
      chartArea: {left: 75, right: 100, height: 250, top: 25},
      width: 550,
      height: 400,
      seriesType: 'bars',
      series: {1: {type: 'line'}},
      responsive: true,
      maintainAspectRatio: false,
      colors: ['#333F50', '#CC3300']
    }
  };
  consumerPerc = {
    chartType: 'PieChart',
    dataTable: [],
    options: {
      legend: true,
      // title: 'Consumer divisi in:',
      subtitle: 'Percentuale di consumer che hanno fatto un acquisto sul totale',
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
    chartType: 'ComboChart',
    dataTable: [],
    options: {
      legend: 'top',
      hAxis: {minValue: 1, gridlines: {color: 'transparent'}, textStyle: {color: '#999', fontName: 'Roboto'}, minTextSpacing: 15, title: 'Mesi dell\'anno'},
      vAxis: {minValue: 0, gridlines: {color: '#eaeaea', count: 5}, textPosition: 'out', textStyle: {color: '#999'}, format: '#', title: 'Valore'},
      chartArea: {left: 75, right: 100, height: 250, top: 25},
      width: 550,
      height: 400,
      seriesType: 'bars',
      series: {1: {type: 'line'}},
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
      hAxis: {title: 'Categoria venditore'},
      vAxis: {minValue: 0, gridlines: {color: '#eaeaea', count: 5}, textPosition: 'out', textStyle: {color: '#999'}, format: '#', title: 'Numero coupon venduti'},
      chartArea: {left: 75, right: 100, height: 250, top: 25},
      width: 550,
      height: 400,
      bar: {groupWidth: '50%'},
      responsive: true,
      maintainAspectRatio: false
    }
  };

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
      this.rangeMonth.push(date.toLocaleString('default', {month: 'long'}));
    }
  }

  currentProfitsChart(month = null) {
    const year = new Date().getFullYear();
    // @ts-ignore
    let monthCoup = month ? document.getElementById("selectCurrent").selectedIndex + 1 : new Date().getMonth() + 1;
    monthCoup = new Date(year, monthCoup).getMonth();
    const date = new Date(year, monthCoup, -1);
    const nameMonth = date.toLocaleString('default', {month: 'long'});

    this.rangeMonthCur = nameMonth;
    const day = date.getDate();
    let price = 0;
    let coupons = [];
    const chartData = [];
    const header = [['Giorni mese corrente', nameMonth.charAt(0).toUpperCase() + nameMonth.slice(1)]];
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
    monthCoup = new Date(year, monthCoup).getMonth();
    const date = new Date(year, monthCoup, -1);
    const nameMonth = date.toLocaleString('default', {month: 'long'});
    this.rangeMonthPrev = nameMonth;
    const day = date.getDate();
    let coupons = [];
    let price = 0;
    const chartData = [];
    const header = [['Giorni mese precedente', nameMonth.charAt(0).toUpperCase() + nameMonth.slice(1)]];

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

    let freq = 0;
    let consumers = [];
    const idConsum = [];
    let couponsMonth = [];

    const chartData = [];
    const header = [['Mesi dell\'anno', 'Numero coupon', 'Frequenza d\'acquisto']];
    if (this.reportCoupons) {
      this.userService.getConsumers()
        .subscribe(cons => {
      coupons = this.reportCoupons.filter(el => new Date(el.timestamp).getFullYear() === year);
      for (let i = 1; i <= month; i++) {
        nameMonth = new Date(year, i, -1).toLocaleString('default', {month: 'long'});
        coupons.forEach(el => (new Date(el.timestamp).getMonth()) + 1 === i ? (nCoupons++, couponsMonth.push(el)) : 0);

        couponsMonth.forEach(el => el ? idConsum.push(el.consumer) : null);
        consumers = cons.filter(el => idConsum.includes(el.id));
        freq = consumers.length === 0 ? 0 : nCoupons / consumers.length;

        chartData.push([nameMonth, nCoupons, freq]);
        nCoupons = 0;
        freq = 0;
        couponsMonth = [];
      }
      this.couponsBougth.dataTable = header.concat(chartData);
      this.couponsBougth = Object.create(this.couponsBougth);
        });
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
    let avg = 0;

    let coupons = [];
    const chartData = [];
    const header = [['Label', 'Ricavo', ' Media']];
    if (this.reportCoupons) {
          coupons = this.reportCoupons.filter(el => new Date(el.timestamp).getFullYear() === year);
          for (let i = 1; i <= month; i++) {
            nameMonth = new Date(year, i, -1).toLocaleString('default', {month: 'long'});
            coupons.forEach(el => (new Date(el.timestamp).getMonth()) + 1 === i ? (price += el.price) : 0);
            avg = coupons.length > 0 ? price / coupons.length : 0;
            chartData.push([nameMonth, price, avg]);
            price = 0;
          }
          this.purchFreq.dataTable = header.concat(chartData);
          this.purchFreq = Object.create(this.purchFreq);
    }
  }

  couponsBrokerChart() {
    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    const day = new Date(year, month, -1).getDate();

    let coupons = [];
    let broker = 0, producer = 0;
    const chartData = [];
    const header = [['Venditore', 'Coupon venduti', {role: 'style'}]];
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

  showText(flag) {
    switch (flag) {
      case 1:
        this.show = this.show === 1 ? 0 : 1;
        break;
      case 2:
        this.show = this.show === 2 ? 0 : 2;
        break;
      case 3:
        this.show = this.show === 3 ? 0 : 3;
        break;
      default:
        this.show = 0;
        break;
    }
  }
}
