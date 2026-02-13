// TEST SCRIPT - Run this in After Effects to verify keyframe repositioning
// This will show you if the code is finding and moving keyframes correctly

(function testKeyframeRepositioning() {
    var comp = app.project.activeItem;
    if (!comp || !(comp instanceof CompItem)) {
        alert("Please select a composition");
        return;
    }

    var layer = comp.selectedLayers[0];
    if (!layer || !(layer instanceof TextLayer)) {
        alert("Please select a text layer");
        return;
    }

    var report = "KEYFRAME ANALYSIS\n";
    report += "==================\n\n";
    report += "Layer: " + layer.name + "\n";
    report += "In Point: " + layer.inPoint + "s\n";
    report += "Out Point: " + layer.outPoint + "s\n";
    report += "Duration: " + (layer.outPoint - layer.inPoint) + "s\n\n";

    var totalKeyframes = 0;

    // Check Text Animators
    report += "TEXT ANIMATORS:\n";
    var textProp = layer.property("ADBE Text Properties");
    if (textProp) {
        var animatorsGroup = textProp.property("ADBE Text Animators");
        if (animatorsGroup) {
            report += "  Found " + animatorsGroup.numProperties + " animator(s)\n";
            for (var a = 1; a <= animatorsGroup.numProperties; a++) {
                var animator = animatorsGroup.property(a);
                report += "  Animator " + a + ": " + animator.name + "\n";
                for (var p = 1; p <= animator.numProperties; p++) {
                    var prop = animator.property(p);
                    if (prop && prop.numKeys && prop.numKeys > 0) {
                        report += "    - " + prop.name + ": " + prop.numKeys + " keyframes\n";
                        report += "      First key at: " + prop.keyTime(1) + "s\n";
                        totalKeyframes += prop.numKeys;
                    }
                }
            }
        } else {
            report += "  No animators found\n";
        }
    }

    // Check Transform
    report += "\nTRANSFORM PROPERTIES:\n";
    var transformProps = ["Position", "Scale", "Rotation", "Opacity"];
    for (var t = 0; t < transformProps.length; t++) {
        try {
            var prop = layer.property("Transform").property(transformProps[t]);
            if (prop && prop.numKeys && prop.numKeys > 0) {
                report += "  - " + transformProps[t] + ": " + prop.numKeys + " keyframes\n";
                report += "    First key at: " + prop.keyTime(1) + "s\n";
                totalKeyframes += prop.numKeys;
            }
        } catch (e) { }
    }

    // Check Effects
    report += "\nEFFECTS:\n";
    var effectsGroup = layer.property("Effects");
    if (effectsGroup && effectsGroup.numProperties > 0) {
        report += "  Found " + effectsGroup.numProperties + " effect(s)\n";
        for (var e = 1; e <= effectsGroup.numProperties; e++) {
            var effect = effectsGroup.property(e);
            report += "  Effect " + e + ": " + effect.name + "\n";
            var hasKeys = false;
            for (var p = 1; p <= effect.numProperties; p++) {
                try {
                    var prop = effect.property(p);
                    if (prop && prop.numKeys && prop.numKeys > 0) {
                        report += "    - " + prop.name + ": " + prop.numKeys + " keyframes\n";
                        totalKeyframes += prop.numKeys;
                        hasKeys = true;
                    }
                } catch (err) { }
            }
            if (!hasKeys) {
                report += "    (no keyframes)\n";
            }
        }
    } else {
        report += "  No effects found\n";
    }

    report += "\n==================\n";
    report += "TOTAL KEYFRAMES: " + totalKeyframes + "\n";

    alert(report);
})();
