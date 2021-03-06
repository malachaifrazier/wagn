# -*- encoding : utf-8 -*-

module Wagn

  include Wagn::Exceptions

  module Loader
    PACKS = [ 'core', 'standard' ].map { |pack| "#{Rails.root}/pack/#{pack}" }
    
    def register_pattern klass, index=nil
      self.set_patterns = [] unless set_patterns
      set_patterns.insert index.to_i, klass
    end
    
    def load_set_patterns
      PACKS.each do |pack|
        dirname = "#{pack}/set_patterns"
        if File.exists? dirname
          Dir.entries( dirname ).sort.each do |filename|
            if m = filename.match( /^(\d+_)?([^\.]*).rb/) and key = m[2]
              mod = Module.new
              filename = [ dirname, filename ] * '/'
              mod.class_eval { mattr_accessor :options }
              mod.class_eval File.read( filename ), filename, 1
            
              klass = Card::SetPattern.const_set "#{key.camelize}Pattern", Class.new( Card::SetPattern )
              klass.extend mod
              klass.register key, (mod.options || {})
            
            end
          end
        end
      end
    end

    def load_formats
      #cheating on load issues now by putting all inherited-from formats in core pack.
      PACKS.each do |pack|
        load_dir File.expand_path( "#{pack}/formats/*.rb", __FILE__ )
      end
    end

    def load_sets
      PACKS.each { |pack| load_implicit_sets "#{pack}/sets" }

      Wagn::Conf[:pack_dirs].split( /,\s*/ ).each do |dirname|
        load_dir File.expand_path( "#{dirname}/**/*.rb", __FILE__ )
      end
    end


    def load_implicit_sets basedir

      Card.set_patterns.reverse.map(&:key).each do |set_pattern|

        next if set_pattern =~ /^\./
        dirname = [basedir, set_pattern] * '/'
        next unless File.exists?( dirname )
        set_pattern_const = Card::Set.const_get_or_set( set_pattern.camelize ) { Module.new }

        Dir.entries( dirname ).sort.each do |anchor_filename|
          next if anchor_filename =~ /^\./
          anchor = anchor_filename.gsub /\.rb$/, ''
          #FIXME: this doesn't support re-openning of the module from multiple calls to load_implicit_sets
          set_module = set_pattern_const.const_get_or_set( anchor.camelize ) { Module.new }
          set_module.extend Card::Set
          
          Card::Set.current_set_opts = { set_pattern.to_sym => anchor.to_sym }
          Card::Set.current_set_module = set_module.name
          
          filename = [dirname, anchor_filename] * '/'
          set_module.class_eval File.read( filename ), filename, 1

          if set_pattern == 'all'
            include_all_model set_module
          end
        end    
      end
    ensure
      Card::Set.current_set_opts = Card::Set.current_set_module = nil
    end

    
    def self.load_layouts
      hash = {}
      PACKS.each do |pack|
        dirname = "#{pack}/layouts"
        next unless File.exists? dirname
        Dir.foreach( dirname ) do |filename|
          next if filename =~ /^\./
          hash[ filename.gsub /\.html$/, '' ] = File.read( [dirname, filename] * '/' )
        end
      end
      hash
    end

    private

    def include_all_model set_module
      Card.send :include, set_module if set_module.instance_methods.any?
      if class_methods = set_module.const_get_if_defined( :ClassMethods )
        Card.send :extend, class_methods
      end
    end


    def load_dir dir
      Dir[dir].sort.each do |file|
        begin
          require_dependency file
        rescue Exception=>e
          Rails.logger.debug "Error loading file #{file}: #{e.message}\n#{e.backtrace*"\n"}"
          raise e
        end
      end
    end

  end
end
