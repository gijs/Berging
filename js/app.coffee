DELTAMAX_167 = 4.1
afvoertabel = 
    afvoercoefficient: [0.3, 0.5, 0.8, 1.2, 1.5, 1.8, 2.3, 3, 4, 5]
    bergingsvolume_t10: [5.1, 4.9, 4.7, 4.3, 4.1, 3.9, 3.6, 3.4, 3.2, 3.0]
    bergingsvolume_t100: [1.9, 1.7, 1.4, 1.1, 1.0, 1.0, 1.1, 1.0, 1.0, 1.0]
    time: [1, 1, 1, 1, 0.883, 0.667, 0.417, 0.333, 0.208, 0.167]
    berging_uur_1: [3.4, 3.4, 3.4, 3.3, 3.3, 3.3, 3.2, 3.2, 3.0, 2.8]
    extra_berging_uur_1: [1.6, 1.6, 1.6, 1.6, 1.5, 1.5, 1.4, 1.4, 1.2, 1.2]
    tijd_uur_1: [0.125, 0.125, 0.125, 0.125, 0.125, 0.125, 0.125, 0.125, 0.125, 0.0833]
    berging_uur_2: [4.2, 4.1, 4.0, 3.9, 3.8, 3.7, 3.5, 3.3, 3.1, 2.9]
    extra_berging_uur_2: [1.8, 1.7, 1.6, 1.5, 1.4, 1.4, 1.4, 1.2, 1.2, 1.1]
    tijd_uur_2: [0.333, 0.333, 0.333, 0.333, 0.333, 0.333, 0.2083, 0.2083, 0.1667, 0.125]


class AppView extends Backbone.View
    el: $("#app")
    tpl: _.template $('#algemene_gegevens').html.toString()

    initialize: =>
        console.log "AppView()"
        @render()
    render: =>
        console.log "render()"
        $('#app').html($('#algemene_gegevens').html())
        # this.el.html($('#algemene_gegevens').html())



class AfvoerModel extends Backbone.Model
    defaults: ->
        done: false
        bruto_opp: 0
        bestaand_verhard: 0
        nieuw_totaal_verhard: 0
        netto_compensatie_opp: 0
        infiltratie_percentage: 0
        maaiveld: 0
        ghg: 0
        infiltratie_snelheid: 0
        afvoercoef_t10: 0
        afvoercoef_t100: 0
        lengte: 0
        talud: 1

    initialize: ->
        console.log "Initializing AfvoerModel"

        volume_berging_infiltratie_per_m2 = (@t10_min + (@ac - @ac_min) / (@ac_max - @ac_min) * (@t10_max - @t10_min)) / 100
        volume_berging_infiltratie_per_m2_1 = (@t10_min_1 + (@ac - @ac_min) / (@ac_max - @ac_min) * (@t10_max_1 - @t10_min_1)) / 100
        volume_berging_infiltratie_per_m2_2 = (@t10_min_2 + (@ac - @ac_min) / (@ac_max - @ac_min) * (@t10_max_2 - @t10_min_2)) / 100
        volume_berging_infiltratie = volume_berging_infiltratie_per_m2 * (@nieuw_verhard_oppervlak - @bestaand_verhard_oppervlak)
        volume_berging_infiltratie_1 = volume_berging_infiltratie_per_m2_1 * (@nieuw_verhard_oppervlak - @bestaand_verhard_oppervlak)
        volume_berging_infiltratie_2 = volume_berging_infiltratie_per_m2_2 * (@nieuw_verhard_oppervlak - @bestaand_verhard_oppervlak)
        extra_berging_t100_per_m2 = (@t100_min + (@ac - @ac_min) / (@ac_max - @ac_min) * (@t100_max - @t100_min)) / 100
        extra_berging_t100_per_m2_1 = (@t100_min_1 + (@ac - @ac_min) / (@ac_max - @ac_min) * (@t100_max_1 - @t100_min_1)) / 100
        extra_berging_t100_per_m2_2 = (@t100_min_2 + (@ac - @ac_min) / (@ac_max - @ac_min) * (@t100_max_2 - @t100_min_2)) / 100
        extra_berging_t100 = @extra_berging_t100_per_m2 * (@nieuw_verhard_oppervlak - @bestaand_verhard_oppervlak)
        extra_berging_t100_1 = @extra_berging_t100_per_m2_1 * (@nieuw_verhard_oppervlak - @bestaand_verhard_oppervlak)
        extra_berging_t100_2 = @extra_berging_t100_per_m2_2 * (@nieuw_verhard_oppervlak - @bestaand_verhard_oppervlak)


        if (@toekomstig_maaiveld_niveau - @ghg - @hoogte) < 1
            oppervlakte_kratten = -2 * @infiltratiesnelheid2 * @time * @hoogte + 
                4 * @infiltratiesnelheid22 * @time2 * @hoogte2 + 
                4 * @hoogte * @delta_max * @porosity / 1000.5 / 
                2 * @hoogte * @porosity / 1002
        else
            oppervlakte_kratten = -2 * @infiltratiesnelheid2 * @time * @hoogte + 
                4 * @infiltratiesnelheid22 * @time2 * @hoogte2 + 
                4 * @hoogte * @delta_max * @porosity / 100 + 4 * @infiltratiesnelheid2 * 
                @time * @delta_max * 0.5 / 
                2 * @hoogte * @porosity / 100 + 2 * @infiltratiesnelheid2 * @time2


        if (@toekomstig_maaiveld_niveau - @ghg - @hoogte) < 1
            oppervlakte_kratten_1 = -2 * @infiltratiesnelheid2 * @time_1 * @hoogte + 
                4 * @infiltratiesnelheid22 * @time_12 * @hoogte2 + 
                4 * @hoogte * @delta_max_1 * @porosity / 1000.5 / 
                2 * @hoogte * @porosity / 1002
        else
            oppervlakte_kratten_1 = -2 * @infiltratiesnelheid2 * @time_1 * @hoogte + 
                4 * @infiltratiesnelheid22 * @time_12 * @hoogte2 + 
                4 * @hoogte * @delta_max_1 * @porosity / 100 + 4 * @infiltratiesnelheid2 * 
                @time_1 * @delta_max_1 * 0.5 / 
                2 * @hoogte * @porosity / 100 + 2 * @infiltratiesnelheid2 * @time_12

        if (@toekomstig_maaiveld_niveau - @ghg - @hoogte) < 1
            oppervlakte_kratten_2 = -2 * @infiltratiesnelheid2 * @time_2 * @hoogte + 
                4 * @infiltratiesnelheid22 * @time_22 * @hoogte2 + 
                4 * @hoogte * @delta_max_2 * @porosity / 1000.5 / 
                2 * @hoogte * @porosity / 1002
        else
            oppervlakte_kratten_2 = -2 * @infiltratiesnelheid2 * @time_2 * @hoogte + 
                4 * @infiltratiesnelheid22 * @time_22 * @hoogte2 + 
                4 * @hoogte * @delta_max_2 * @porosity / 100 + 4 * @infiltratiesnelheid2 * 
                @time_2 * @delta_max_2 * 0.5 / 
                2 * @hoogte * @porosity / 100 + 2 * @infiltratiesnelheid2 * @time_22


        breedte = @delta_max / @hoogte + @infiltratiesnelheid2 * @time * @lengte + @talud * @hoogte
        breedte_1 = @delta_max_1 / @hoogte + @infiltratiesnelheid2 * @time_1 * @lengte + @talud * @hoogte
        breedte_2 = @delta_max_2 / @hoogte + @infiltratiesnelheid2 * @time_2 * @lengte + @talud * @hoogte

        breedte_max = Math.max(breedte, breedte_1, breedte_2)

        if (breedte_max - 2 * @talud * @hoogte) < 0
            talud_nieuw = ((@breedte_max - @talud * @hoogte) / (@hoogte)) - 0.05
            hoogte_nieuw = ((@breedte_max - @talud * @hoogte) / (@talud)) - 0.05
            @lengte_nieuw = (((@breedte_max - (@talud * @hoogte)) / (@talud * @hoogte)) * @lengte) - 0.05


    validate = (attrs) =>
        console.log "Validating"
        console.log attrs
        if @ac >= @ac_min and @ac <= @ac_max
            "false"
        if infiltratiesnelheid1 < 0.5
            @infiltratiesnelheid2 = 0
            @delta_max = min(@delta_max, DELTAMAX_167)
        if infiltratiesnelheid1 >= 0.5 and infiltratiesnelheid1 <= 2
            @infiltratiesnelheid2 = ((infiltratiesnelheid1 - 0.5) / 1.5) * infiltratiesnelheid1
        if infiltratiesnelheid1 > 2
            @infiltratiesnelheid2 = infiltratiesnelheid1

    toggle: ->
        this.save done:!@get 'done'

    get_max_hoogte: =>
        max_hoogte = @toekomstig_maaiveld_niveau - @ghg - 0.5
        max_hoogte


$(document).ready ->
    # a = new AfvoerModel
    # a.set 'talud': -3
    # a.save
    # console.log a.get 'talud'
    window.app = new AppView

