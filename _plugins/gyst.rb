require 'httparty'

module Jekyll
  class Gyst < Liquid::Tag
    def initialize(tag_name, url, tokens)
      super
      @url = url.strip
    end

    def render(context)
      #TODO: Add HTTP error handling
      response = HTTParty.get(@url)

      body = response.body

      range = @url[/#L\d{1,}(\-L\d{1,})?/, 0]

      if not range.empty?
        range = range
            .gsub(/#|L/, '')
            .split('-')

        content = response.body.split("\n");

        if range.length() == 1
          s = range[0].to_i - 1
          body = content[s]
        else
          s = range[0].to_i - 1
          e = range[1].to_i - 1
          body = content[s..e].join("\n")
        end
      end

      site = context.registers[:site]
      converter = site.find_converter_instance(::Jekyll::Converters::Markdown)

      template = "```java\n"\
      "#{body}\n"\
      "```"

      converter.convert(template)
      
    end

  end
end

Liquid::Template.register_tag('gyst', Jekyll::Gyst)
