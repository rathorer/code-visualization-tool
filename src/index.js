import tabularCliParser from "./cliParser.js"; 


const initialize = function() {
    const CONSTANTS = Object.freeze({
        rectWidth: 200,
        rectHeight: 60,
        arrowLength: 180,
        arrowHeadWidth: 10,
        arrowHeadHeight: 15,
        rectColor: 'rgba(104, 104, 104, 0.856)',
        arrowColor: 'rgba(104, 104, 104, 0.856)'
    });

    let methodHierarchy = tabularCliParser();

    let classHierarchy =
    {
        name: "Program",
        desc: "This is starting class.",
        dependsOn: [
            {
                name: "ImgTool", desc: "Image tool class.",
                dependsOn: [
                    { name: "ImageResizer", desc: "Image resizer class." },
                    { name: "Drawing", desc: "Dotnet drawing class." },
                    { name: "Directory", desc: "Dotnet drawing class." },
                    { name: "System.IO", desc: "Dotnet drawing class." },
                    { name: "Bitmap", desc: "Bitmap dotnet drawing class." }
                ]
            }
        ]
    };
    let canvas = new fabric.Canvas('mainCanvas');
    window.can = canvas;
    const drawPoint = function (pos) {
        let point = new fabric.Circle({
            radius: 1,
            left: pos.left,
            top: pos.left,
            origin: 'center',
            fill: 'red'
        });
        window.can.add(point);
        window.can.requestRenderAll();
    };
    const getArrow = function (startsAt, length, angle) {
        let factor = angle <= 0 ? -1.5 : +1.5;
        var line = new fabric.Line([startsAt.left, startsAt.top, startsAt.left + length - CONSTANTS.arrowHeadHeight, startsAt.top], {
            left: startsAt.left + factor,
            top: startsAt.top,
            stroke: CONSTANTS.arrowColor,
            strokeWidth: 1
        });
        const linePoints = line.calcLinePoints();
        const scaleX = line.scaleX || 1;
        const scaleY = line.scaleY || 1;
        let coords = line.getBoundingRect();
        const points = line.calcLinePoints();
        const matrix = line.calcTransformMatrix();
        const point1 = fabric.util.transformPoint({ x: points.x1, y: points.y1 }, matrix);
        const point2 = fabric.util.transformPoint({ x: points.x2, y: points.y2 }, matrix);
        const lineCoords = line.calcACoords();

        console.log(lineCoords);
        let lineEndCoords = {
            x: line.left + linePoints.x2 * scaleX,
            y: line.top + linePoints.y1 * scaleY,
        };
        let triangleLeft, triangleTop;
        //if(angle < 0){
        triangleLeft = lineCoords.tr.x + CONSTANTS.arrowHeadHeight,
            triangleTop = lineCoords.tr.y - CONSTANTS.arrowHeadWidth / 2
        // } else{
        //     triangleLeft = lineCoords.tr.x + CONSTANTS.arrowHeadHeight,
        //         triangleTop = lineCoords.tr.y + CONSTANTS.arrowHeadWidth/2
        // }
        //console.log(lineEndCoords);
        var triangle = new fabric.Triangle({
            width: CONSTANTS.arrowHeadWidth,
            height: CONSTANTS.arrowHeadHeight,
            fill: 'transparent',
            stroke: CONSTANTS.arrowColor,
            strokeWidth: 1,
            left: triangleLeft,
            top: triangleTop,
            angle: 90
        });

        console.log(line);

        var arrow = new fabric.Group([line, triangle]);
        return arrow
    };
    // create a class representation object
    const getClassRepresentation = function (pos, name) {
        let classRect = new fabric.Rect({
            left: pos.left,
            top: pos.top,
            stroke: CONSTANTS.rectColor,
            strokeWidth: 1,
            fill: 'transparent',
            width: CONSTANTS.rectWidth,
            height: CONSTANTS.rectHeight
        });

        let rectCenterLeft = pos.left + (classRect.width / 2),
            rectCenterTop = pos.top + (classRect.height / 2);
        let classText = new fabric.Text(name, {
            fontFamily: 'Calibri',
            fontSize: 16,
            left: rectCenterLeft,
            top: rectCenterTop,
            textAlign: 'center',
            originX: 'center',
            originY: 'center',
        });

        let classRep = new fabric.Group([classRect, classText], {
            // any group attributes here
        });

        classRep.hasControls = true;
        return classRep;
    };


    const drawDiagram = function (hierarchy, pos) {
        if (hierarchy && hierarchy.name) {
            canvas.requestRenderAll();
            let classRect = getClassRepresentation(pos, hierarchy.name);
            canvas.add(classRect);
            if (hierarchy.dependsOn && Array.isArray(hierarchy.dependsOn) && hierarchy.dependsOn.length > 0) {
                let connectingArrows = hierarchy.dependsOn.length,
                    startAngle = 0,
                    incrementFactor = 0;
                if (connectingArrows > 1) {
                    startAngle = -connectingArrows * 30 / 2;
                    incrementFactor = (connectingArrows * 30) / (connectingArrows - 1);
                }
                for (let index = 0; index < hierarchy.dependsOn.length; index++) {
                    let classRectCoords = classRect.calcOCoords();
                    let arrowLeft = classRectCoords.mr.x,//pos.left + classRect.width,
                        arrowTop = classRectCoords.mr.y;
                    let angle = startAngle + index * incrementFactor;
                    // let p = {left: arrowLeft+ 40*Math.cos(angle * Math.PI/180), top: arrowTop+ 40*Math.sin(angle * Math.PI/180)};
                    // console.log(p);
                    // drawPoint(p);
                    console.log(angle);
                    let arrow1 = getArrow({ left: arrowLeft, top: arrowTop }, CONSTANTS.arrowLength, angle);
                    arrow1.angle = angle;
                    //arrow1.rotate(angle);
                    canvas.add(arrow1);
                    const cl = hierarchy.dependsOn[index];
                    drawDiagram(cl, { left: arrow1.left + CONSTANTS.arrowLength, top: classRect.top + angle * 1.6 });
                }
            }
        }
    }
    drawDiagram(methodHierarchy, { left: 80, top: 150 });
};

initialize();