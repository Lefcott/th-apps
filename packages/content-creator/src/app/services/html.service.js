/** @format */

'use strict';

const targetInlineStyles = [
	'box-sizing',
	'color',
	'display',
	'font-family',
	'font-size',
	'font-style',
	'font-weight',
	'height',
	'inline-size',
	'letter-spacing',
	'line-break',
	'line-height',
	'list-style',
	'list-style-position',
	'overflow',
	'position',
	'text-align',
	'text-overflow',
	'text-size-adjust',
	'white-space',
	'word-break',
	'word-spacing',
	'letter-spacing',
	'vertical-align',
	'width'
];

export default class HtmlService {
	static get $inject () {
		return [
			'$http',
			'$state',
			'$log',
			'CachedCredentials',
			'$window',
			'urlService',
			'masterService',
			'$timeout',
			'contentEditorService',
			'$compile',
			'$rootScope',
		];
	}

	constructor (
		$http,
		$state,
		$log,
		CachedCredentials,
		$window,
		urlService,
		masterService,
		$timeout,
		contentEditorService,
		$compile,
		$rootScope,
	) {
		this.$http = $http;
		this.$state = $state;
		this.$log = $log;
		this.cachedCredentials = new CachedCredentials().getCredentials();
		this.$window = $window;
		this.urlService = urlService;
		this.masterService = masterService;
		this.$timeout = $timeout;
		this.contentEditorService = contentEditorService;
		this.$compile = $compile;
		this.$rootScope = $rootScope;

		this.masterObj = this.masterService.getUrlParams();

		this.notPublished = false;
		this.guid = this.masterObj.documentId; // current saved guid

		this.disableSaveBtn = false;

		this.publish = {
			warn: false,
			save: false,
			fail: false,
		};
		this.disableAddPageBtn = false;
	}

	getHtml () {
		// replaces layout componet tags to divs
		const html = $('.reveal');

		const pairs = [];
		$('#content-creator')
			.find('.text *')
			.each((i, element) => {
				const originalHTML = element.outerHTML;
				const computed = this.computedStyleToInlineStyle(element);

				pairs.push({ originalHTML, computed });
			});
		const computedHtml = html.get(0).outerHTML;

		pairs.forEach(({ originalHTML, computed }) => {
			computed.outerHTML = originalHTML;
		});

		const clonedHtml = $(computedHtml);
		clonedHtml.find('.slides').removeClass('editor');
		clonedHtml.find('section').removeClass('present');
		clonedHtml.find('section').removeClass('future');
		clonedHtml.find('section').removeClass('past');
		clonedHtml.find('.slide__frame').remove();

		clonedHtml.css('transform', '');

		clonedHtml.find('.backgrounds').removeAttr('style');
		clonedHtml.find('[ng-src]').removeAttr('src');

		return clonedHtml.prop('outerHTML');
	}

	computedStyleToInlineStyle (element) {
		if (!element) {
			throw new Error('No element specified.');
		}

		const computedStyle = window.getComputedStyle(element, null);
		let cssText = targetInlineStyles.map(
			(style) => `${style}: ${computedStyle.getPropertyValue(style)}`,
		);
		const css = cssText.join(';')

		$(element).attr('style', css);

		Array.from(element.children).forEach((child) =>
			this.computedStyleToInlineStyle(child),
		);

		return element;
	}

	measureImagesEh () {
		let getImageElements = angular.element(
			document.querySelectorAll('.ce-element--type-image'),
		);
		for (let i = 0; i < getImageElements.length; i++) {
			let widgetName = '';
			let myWidth = getImageElements[i].clientWidth;
			let myHeight = getImageElements[i].clientHeight;
			let parentWidth = getImageElements[i].parentElement.clientWidth;
			let parentHeight = getImageElements[i].parentElement.clientHeight;
			let width = Math.round((myWidth / parentWidth) * 100) + '%';
			let height = Math.round((myHeight / parentHeight) * 100) + '%';
			getImageElements[i].setAttribute('data-widthPercentage', width);
			getImageElements[i].setAttribute('data-heightPercentage', height);
			let attributes = getImageElements[i].attributes;
			let attrArray = Array.from(attributes);
			attrArray.forEach((element, index) => {
				if (element.name === 'widget') {
					widgetName = element.value;
				}
				getImageElements[i].setAttribute('widget', widgetName);
			});
		}
	}

	async saveToServer (origin, callback) {
		this.timeStampForPopup = Date.now();

		let completeHtml = this.getHtml();

		this.disableSaveBtn = true;

		// data obj to post
		let saveData = {
			guid: this.guid,
			communityId: this.masterObj.communityId,
			communityName: this.masterObj.communityName,
			type: this.masterObj.type,
			name: this.masterObj.documentName,
			template: this.masterObj.template || false,
			editorType: 'document',
			orientation: this.masterObj.orientation,
			pages: [],
			data: completeHtml,
		};

		let docSections = $(completeHtml).find('section');

		// Create array of page objects
		for (let i = 0; i < docSections.length; i++) {
			let pageDuration = $(docSections[i]).attr('data-page-duration');
			if (pageDuration == null || pageDuration == undefined) {
				pageDuration = 15;
			}

			saveData.pages.push({
				page: i,
				duration: pageDuration,
			});
		}

		return this.$http({
			method: 'POST',
			url: `${this.urlService.getDocument()}/document`,
			data: saveData,
		})
			.then((response) => {
				this.guid = response.data.guid;
				//save to cache
				if (this.cachedCredentials) {
					this.cachedCredentials.documentId = this.guid;
					this.$window.localStorage.setItem(
						'cachedCredentials',
						JSON.stringify(this.cachedCredentials),
					);
				}
				this.contentEditorService.dirty = false;
				this.publish.save = true;
				if (origin == 'save' || origin == 'reorder') {
					if (
						this.notPublished == true &&
						this.modificationsHaveBeenMade == false
					) {
						// keep as true
						this.notPublished == true;
					} else {
						this.notPublished = this.modificationsHaveBeenMade;
					}
					this.publish.warn = this.modificationsHaveBeenMade;
					this.$timeout(() => {
						this.publish.save = false;
					}, 8000);
				}
				if (origin == 'publish') {
					this.publish.warn = this.modificationsHaveBeenMade;
					this.publish.save = false;
					this.notPublished = false;
				}

				if (typeof callback === 'function') {
					return callback();
				}
			})
			.catch((e) => {
				this.publish.fail = true;
				this.$timeout(() => {
					this.publish.fail = false;
				}, 8000);
				this.notPublished = false;
				this.publish.warn = false;
				this.$log.error(
					'Your document did not save properly. Please try again!',
					e,
				);
				if (typeof callback === 'function') {
					callback('error');
				}
			})
			.finally(() => {
				this.disableSaveBtn = false;
			});
	}

	// Download document/template from S3
	async downloadDocument (document) {
		// Remove Reveal js paging from URL
		let filename = document.url.substring(0, document.url.indexOf('#/'));
		let urlResponse = await this.$http({
			method: 'GET',
			url: `${this.urlService.getDocument()}/download?filename=${filename}`,
		});
		let fileResponse = await this.$http({
			method: 'GET',
			url: urlResponse.data.url,
		});
		return fileResponse.data;
	}

	updateWidgetAttr () {
		let getImageElements = angular.element(
			document.querySelectorAll('.ce-element--type-image'),
		);
		for (let i = 0; i < getImageElements.length; i++) {
			let stringMess = getImageElements[i].getAttribute('style');
			if (stringMess.includes('widget-')) {
				let start = stringMess.indexOf('widget-');
				let end = stringMess.indexOf('.svg');
				// TODO: note that expected placeholder images for widgets are .svg
				let widgetName = stringMess.slice(start + 7, end);
				getImageElements[i].setAttribute('widget', widgetName + '-widget');
			}
		}
	}

	async insertPages (pagesList) {
		let firstPage = true;

		for (let index in pagesList) {
			let page = pagesList[index];
			let section = await this.$http({
				method: 'GET',
				url: `${this.urlService.getDocument()}/document/${
					page.data.document
				}/page/${page.data.page}`,
			});
			if (firstPage) {
				section = this.prepareSlideSection($(section.data));
				$(this.contentEditorService.currentSlide).removeClass('present');
				$(this.contentEditorService.currentSlide).addClass('future');
				$(section).addClass('present');
				$(section).insertBefore(this.contentEditorService.currentSlide);
				this.contentEditorService.currentSlide = $('section.present');
				this.contentEditorService.checkPermissions();
			} else {
				section = this.prepareSlideSection($(section.data));
				$(section).addClass('future');
				$(section).insertAfter(this.contentEditorService.currentSlide);
				this.contentEditorService.checkPermissions();
			}
			this.contentEditorService.totalSlideNumber = Reveal.getTotalSlides();
			this.$rootScope.$apply();
			firstPage = false;
			this.contentEditorService.slideRemove = true;
			this.contentEditorService.clearCurrent();
			Reveal.sync();
			this.contentEditorService.saveState();
		}
	}

	async applyTemplate (document) {
		const cleaned = document.replace(
			/Gotham SSm A,\s*Gotham SSm B/gi,
			'Times New Roman',
		);
		let section = $(cleaned).find('section')[0];
		this.renderTemplate(section);
	}

	// Load and apply a template in the current page of the document
	async renderTemplate (section) {
		section = this.prepareSlideSection(section);
		$(section).addClass('present');
		$(this.contentEditorService.currentSlide).replaceWith(section);
		this.contentEditorService.currentSlide = $('section.present');
		this.contentEditorService.totalSlideNumber = Reveal.getTotalSlides();
		this.contentEditorService.clearCurrent();
		this.contentEditorService.updateWidgetAttributes();
		this.$rootScope.$applyAsync();
		this.contentEditorService.saveState();
		this.contentEditorService.checkPermissions();
		Reveal.sync();
	}

	// Adds event listeners to Section's elements
	prepareSlideSection (section) {
		let content = $(section).children();
		for (let element of Array.from(content)) {
			$(element).mousedown(
				$.proxy(this.contentEditorService.mouseDown, this.contentEditorService),
			);
			if ($(element).hasClass('image-obj')) {
				let elementStyle = $(element)
					.find('.image-component')
					.attr('style');
				$(section).append(this.$compile(element)(this.$rootScope));
				if (elementStyle) {
					$(element)
						.find('.image-component')
						.attr('style', elementStyle);
				}
			} else if ($(element).hasClass('text-box')) {
				let content = $(element)
					.find('.text')
					.html();
				$(section).append(this.$compile(element)(this.$rootScope));
				$(section)
					.find(element)
					.find('.text')
					.html(content);
			} else if (
				$(element)
					.children()
					.hasClass('month-calendar-comp')
			) {
				let date = new Date(
					$(element)
						.find('month-calendar')
						.attr('date'),
				);
				let month = date.getMonth();
				let year = date.getFullYear();
				this.contentEditorService.weekCount(month, year, false);
				$(section).append(this.$compile(element)(this.$rootScope));
			} else if ($(element).hasClass('widget-obj')) {
				$(section).append(this.$compile(element)(this.$rootScope));
			} else {
				$(section).append(element);
			}
		}
		return section;
	}

	// Loads and display a document in the editor
	async loadDocument (id) {
		let response = await this.$http({
			method: 'GET',
			url: `${this.urlService.getDocument()}/document/${id}`,
			headers: {
				'Content-Type': undefined,
			},
		});

		let document = await this.downloadDocument(response.data.pages[0]);
		const dom = $(document);
		dom.find('.text *').each(function () {
			const el = $(this);
			const styles = {
				fontFamily: el.css('fontFamily') || 'Open Sans',
				color: el.css('color'),
				fontSize: el.css('fontSize'),
				textAlign: el.css('textAlign')
			};

			el.removeAttr('style').css(styles);
		});

		$('section.present').remove(); // Need to clear current section
		let sections = dom.find('section');

		for (let section of Array.from(sections)) {
			// Need to add class "future" so Reveal js knows what to display
			$(section).addClass('future');
			section = this.prepareSlideSection(section);
			$(section).insertBefore('#grid');
		}

		// Remove class future and add class present to first slide
		// so Reveal js knows where to start
		$('section')
			.first()
			.removeClass('future');
		$('section')
			.first()
			.addClass('present');
		this.contentEditorService.currentSlide = $('section.present');
		this.contentEditorService.totalSlideNumber = Reveal.getTotalSlides();
		if (this.contentEditorService.totalSlideNumber > 1) {
			this.contentEditorService.slideRemove = true;
		}
		this.contentEditorService.initPageState();
		this.contentEditorService.updateWidgetAttributes();

		Reveal.sync();
		this.$rootScope.$apply();
	}

	async loadTemplates () {
		// fetch theme layouts from document endpoint
		let templates = await this.$http({
			method: 'GET',
			url: `${this.urlService.getDocument()}/document?communityId=${
				this.masterObj.communityId
			}&template=true`,
		});
		return templates.data.documents;
	}

	checkPublished (savedContent) {
		if (savedContent.published) {
			if (savedContent.updatedAt > savedContent.published) {
				this.notPublished = true;
			} else {
				return;
			}
		} else {
			return;
		}
	}

	async deletePage (document, page) {
		await this.$http({
			method: 'DELETE',
			url: `${this.urlService.getDocument()}/document/${document}/page/${page}`,
		});
		Reveal.sync();
	}
}
