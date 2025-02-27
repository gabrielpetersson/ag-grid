import { Scale } from '../scale/scale';
import { Axis, TickInterval } from '../axis';
import { ChartAxisDirection } from './chartAxisDirection';
import { LinearScale } from '../scale/linearScale';
import { POSITION, STRING_ARRAY, Validate } from '../util/validation';
import { AgCartesianAxisPosition, AgCartesianAxisType } from './agChartOptions';

export function flipChartAxisDirection(direction: ChartAxisDirection): ChartAxisDirection {
    if (direction === ChartAxisDirection.X) {
        return ChartAxisDirection.Y;
    } else {
        return ChartAxisDirection.X;
    }
}

interface BoundSeries {
    type: string;
    getDomain(direction: ChartAxisDirection): any[];
    isEnabled(): boolean;
    visible: boolean;
}

interface BoundSeries {
    type: string;
    getDomain(direction: ChartAxisDirection): any[];
    isEnabled(): boolean;
    visible: boolean;
}

export class ChartAxis<S extends Scale<D, number, TickInterval<S>> = Scale<any, number, any>, D = any> extends Axis<
    S,
    D
> {
    @Validate(STRING_ARRAY)
    keys: string[] = [];

    direction: ChartAxisDirection = ChartAxisDirection.Y;
    boundSeries: BoundSeries[] = [];
    linkedTo?: ChartAxis;
    includeInvisibleDomains: boolean = false;

    get type(): AgCartesianAxisType {
        return (this.constructor as any).type || '';
    }

    protected useCalculatedTickCount() {
        // We only want to use the new algorithm for number axes. Category axes don't use a
        // calculated or user-supplied tick-count, and time axes need special handling depending on
        // the time-range involved.
        return this.scale instanceof LinearScale;
    }

    @Validate(POSITION)
    protected _position: AgCartesianAxisPosition = 'left';
    set position(value: AgCartesianAxisPosition) {
        if (this._position !== value) {
            this._position = value;
            switch (value) {
                case 'top':
                    this.direction = ChartAxisDirection.X;
                    this.rotation = -90;
                    this.label.mirrored = true;
                    this.label.parallel = true;
                    break;
                case 'right':
                    this.direction = ChartAxisDirection.Y;
                    this.rotation = 0;
                    this.label.mirrored = true;
                    this.label.parallel = false;
                    break;
                case 'bottom':
                    this.direction = ChartAxisDirection.X;
                    this.rotation = -90;
                    this.label.mirrored = false;
                    this.label.parallel = true;
                    break;
                case 'left':
                    this.direction = ChartAxisDirection.Y;
                    this.rotation = 0;
                    this.label.mirrored = false;
                    this.label.parallel = false;
                    break;
            }
        }
    }
    get position(): AgCartesianAxisPosition {
        return this._position;
    }

    protected calculateDomain() {
        const { direction, boundSeries, includeInvisibleDomains } = this;

        if (this.linkedTo) {
            this.dataDomain = this.linkedTo.dataDomain;
        } else {
            const domains: any[][] = [];
            boundSeries
                .filter((s) => includeInvisibleDomains || s.isEnabled())
                .forEach((series) => {
                    domains.push(series.getDomain(direction));
                });

            const domain = new Array<any>().concat(...domains);
            this.dataDomain = this.normaliseDataDomain(domain);
        }
    }

    normaliseDataDomain(d: D[]): D[] {
        return d;
    }

    isAnySeriesActive() {
        return this.boundSeries.some((s) => this.includeInvisibleDomains || s.isEnabled());
    }
}
