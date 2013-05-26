/*global define,d3*/

define([
    'jquery',
    'underscore',
    'views/WidgetView',
    'views/widgets/FilterView',
    'text!templates/widgets/WalkPathsWidget.tpl',
    'd3'
], function ($, _, WidgetView, FilterView, template) {
    'use strict';

    var WalkPathsView = WidgetView.extend({
        el: '.walkPaths .content',
        events: {
            'click a': 'switchLabel',
            'click .taskList a': 'switchTask'
        },
        initialize: function() {
            this.param = {};

            this.render();
        },
        render: function() {

            var content = {
                tasks: this.testcase.get('tasks')
            };

            this.$el.prepend(_.template( template, content));

            this.filterView = new FilterView(this.$el.find('nav'),this,this.buildTree);
        },
        buildTree: function() {
            this.maxWidth = 750;
            this.containerWidth = 940;
            this.rectWidth = 150;

            var m = [30, 30, 30, 30],
                w = this.containerWidth - m[1] - m[3],
                h = 800 - m[0] - m[2];

            this.finishedInitialization = false;
            this.$el.find('svg').remove();

            this.json = this.testrunCollection.generateWalkPath(this.param);

            if(!this.json) {
                this.$el.append('<i class="nocontent">no data available</i>');
                this.$el.css('overflow','visible');
                return;
            }

            this.tree = d3.layout.tree().size([h, w]);
            this.diagonal = d3.svg.diagonal().projection(function(d) { return [d.y, d.x]; });

            this.vis = d3.select('.walkPaths .content').append('svg:svg')
                .attr('width', w + m[1] + m[3])
                .attr('height', h + m[0] + m[2])
                .append('svg:g')
                .attr('transform', 'translate(' + m[3] + ',' + m[0] + ')');

            this.root = this.json;
            this.root.x0 = h / 2;
            this.root.y0 = 0;

            this.update(this.root);
            this.root.children.forEach(this.toggleAll.bind(this));
            this.update(this.root);
            this.finishedInitialization = true;

        },
        update: function(source) {
            var i = 0,
                that = this,
                runCnt = this.testrunCollection.models.length,
                duration = d3.event && d3.event.altKey ? 5000 : 500;

            // Compute the new tree layout.
            var nodes = this.tree.nodes(this.root).reverse();

            // Normalize for fixed-depth.
            nodes.forEach(function(d) { d.y = d.depth * 180; });

            // Update the nodes…
            var node = this.vis.selectAll('g.node').data(nodes, function(d) { return d.id || (d.id = ++i); });

            // Enter any new nodes at the parent's previous position.
            var nodeEnter = node.enter().append('svg:g')
                .attr('class', 'node')
                .attr('transform', function() { return 'translate(' + source.y0 + ',' + source.x0 + ')'; })
                .on('click', function(d) { that.toggle(d); that.update(d); })
                .on('mouseenter', this.showUrl)
                .on('mouseleave', this.hideUrl);

            nodeEnter.append('svg:circle')
                .attr('r', function(d) { return (Math.round(d.marching/runCnt * 20))+'px'; })
                .style('fill', function(d) { return d._children && d._children.length ? 'lightsteelblue' : '#fff'; });

            nodeEnter.append('svg:rect')
                .attr('x', function(d) { return d.children || d._children ? -16 : 16; })
                .attr('y', function(d) { return d.children || d._children ? -35 : 35; })
                .attr('height', 23)
                .attr('width', this.rectWidth)
                .attr('rx', 3)
                .attr('ry', 3);

            nodeEnter.append('svg:text')
                .attr('x', function(d) { return d.children || d._children ? -10 : 10; })
                .attr('y', function(d) { return d.children || d._children ? -23 : 23; })
                .attr('dy', '.35em')
                .attr('text-anchor', function(d) { return d.children || d._children ? 'start' : 'start'; })
                .text(function(d) { return that.sanitize(d.name); })
                .style('fill-opacity', 1e-6);

            // Transition nodes to their new position.
            var nodeUpdate = node.transition()
                .duration(duration)
                .attr('transform', function(d) { return 'translate(' + d.y + ',' + d.x + ')'; });

            nodeUpdate.select('circle').style('fill', function(d) { return d._children && d._children.length ? 'lightsteelblue' : '#fff'; });
            nodeUpdate.select('text').style('fill-opacity', 1);

            // Transition exiting nodes to the parent's new position.
            var nodeExit = node.exit().transition()
                .duration(duration)
                .attr('transform', function() { return 'translate(' + source.y + ',' + source.x + ')'; })
                .remove();

            nodeExit.select('text').style('fill-opacity', 1e-6);

            // Update the links…
            var link = this.vis.selectAll('path.link').data(this.tree.links(nodes), function(d) { return d.target.id; });

            // Enter any new links at the parent's previous position.
            link.enter().insert('svg:path', 'g')
                .attr('class', 'link')
                .style('stroke-width', function(d) { return (Math.round(d.target.marching/runCnt * 40))+'px'; })
                .attr('d', function() {
                    var o = {x: source.x0, y: source.y0};
                    return that.diagonal({source: o, target: o});
                })
                .transition()
                .duration(duration)
                .attr('d', that.diagonal);

            // Transition links to their new position.
            link.transition()
                .style('stroke-width', function(d) { return (Math.round(d.marching/runCnt * 40))+'px'; })
                .duration(duration)
                .attr('d', that.diagonal);

            // Transition exiting nodes to the parent's new position.
            link.exit().transition()
                .duration(duration)
                .attr('d', function() {
                    var o = {x: source.x, y: source.y};
                    return that.diagonal({source: o, target: o});
                })
                .remove();

            // Stash the old positions for transition.
            nodes.forEach(function(d) {
                d.x0 = d.x;
                d.y0 = d.y;
            });
        },
        toggle: function(d) {

            if(d.children) {
                d._children = d.children;
                d.children = null;
                this.recalcPosition(false);
            } else {
                d.children = d._children;
                d._children = null;
                this.recalcPosition(true);
            }

        },
        toggleAll: function(d) {
            if (d.children) {
                d.children.forEach(this.toggleAll.bind(this));
                this.toggle(d);
            }
        },
        recalcPosition: function(openAction) {

            if(!this.finishedInitialization) {
                return;
            }

            this.maxXPos = 0;
            this.findMaxXPosition(this.root);

            var svg   = this.$el.find('svg'),
                width = parseInt(svg.attr('width'),10);

            if(openAction && this.maxXPos > this.maxWidth) {
                svg.animate({
                    left: this.maxWidth - this.maxXPos
                },500);
                svg.attr('width',this.maxXPos+200);
            }

            if(this.maxXPos < this.maxWidth && parseInt(svg.css('width'),10) > this.maxWidth) {
                svg.animate({
                    left: 0
                },500);
                svg.attr('width',this.containerWidth);
            } else if(!openAction && this.maxXPos > this.maxWidth && width > this.maxXPos) {
                svg.animate({
                    left: -(this.maxXPos - this.maxWidth)
                },500);
                svg.attr('width',this.maxXPos+200);
            }

        },
        findMaxXPosition: function(node) {

            if(node.y > this.maxXPos) {
                this.maxXPos = node.y;
            }

            for(var i = 0; node.children && i < node.children.length; ++i) {
                this.findMaxXPosition(node.children[i]);
            }
        },
        sanitize: function(url) {
            url = url.replace('http://','').replace('https://','');
            url = url.slice(url.indexOf('/'));

            if(url.length > 20) {
                url = url.slice(0,18)+'...';
            }

            return url;
        },
        switchLabel: function(e) {
            var elem = $(e.target);

            if(e.target.nodeName.toLowerCase() === 'i') {
                elem = elem.parent();
            }

            // clear button action
            if(elem.data('param')) {
                delete this.param[elem.data('param')];
                elem.css('display','none');
                this.buildTree();
            }

            var label = elem.data('placeholder') ? elem.data('placeholder') : elem.html();
            elem.parents('.btn-group').find('>.btn:first-Child').html(label);

            this.$el.find('.nocontent').remove();
            this.$el.find('.testrunList').css('display','inline-block');
            this.$el.css('overflow','hidden');
        },
        switchTask: function(e) {
            var elem = $(e.target);
            this.param.task = elem.attr('href').substr(3);
            this.buildTree();
        },
        showUrl:function(d) {
            var svgWidth = $('.walkPaths').find('svg').width() - 40;
            d3.select(this).select('text').text(function() {return d.name;});

            var width = $(this).find('text').width() + 13;
            $(this).find('rect').attr('width',width > 150 ? width : 150);

            if(d.y + width > svgWidth) {
                var diff = d.y + width - svgWidth;
                $(this).find('rect').attr('x',function(id,x) { return parseInt(x,10) - diff; });
                d3.select(this).select('text').attr('x', function(id,x) { return parseInt(x,10) - diff - 10; });
            }

        },
        hideUrl:function(d) {
            var url = d.name.replace('http://','').replace('https://','');
            url = url.slice(url.indexOf('/'));

            if(url.length > 20) {
                url = url.slice(0,18)+'...';
            }

            d3.select(this).select('text')
                .text(function() { return url; })
                .attr('x', function(d) { return d.children || d._children ? -10 : 10; });

            $(this).find('rect')
                .attr('width',150)
                .attr('x', function(d) { return d.children || d._children ? 16 : -16; });

        }
    });

    return WalkPathsView;
});